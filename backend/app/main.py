import logging
import uvicorn
from typing import Annotated
from os import environ as env
from datetime import datetime
from sqlalchemy.orm import aliased
from sqlmodel import Session, select, or_, asc, desc
from fastapi import FastAPI, Depends, HTTPException
from starlette.middleware.cors import CORSMiddleware
from external.models.data_base import Note, History
from external.clients.database import create_db_and_tables, get_session
from external.models.request import AddNoteParams, ModifyNoteParams, GetNotesParams, GetHistoryParams, \
    DeleteHistoryParams, DeleteNoteParams



logger = logging.getLogger(__name__)
SqlSession = Annotated[Session, Depends(get_session)]
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=[env["CORS_ORIGIN"]],
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.on_event("startup")
def on_startup():
    create_db_and_tables()



@app.get("/get_notes")
def get_notes(params: Annotated[GetNotesParams, Depends()], session: SqlSession):
    try:
        sql_request = select(Note).where(Note.status == Note.NoteStatus.EXISTS)

        if params.ids is not None:
            sql_request = sql_request.where(Note.id.in_(params.ids))

        if params.search_line is not None:
            sql_request = sql_request.where(
                or_(
                    Note.name.contains(params.search_line),
                    Note.description.contains(params.search_line),
                )
            )

        if params.start_time is not None:
            sql_request = sql_request.where(Note.end_time >= params.start_time)

        if params.end_time is not None:
            sql_request = sql_request.where(Note.start_time <= params.end_time)

        if params.sort_by_time is not None:
            order_func = desc if params.sort_by_time else asc
            sql_request = sql_request.order_by(order_func(Note.start_time))

        if params.sort_by_name is not None:
            order_func = desc if params.sort_by_name else asc
            sql_request = sql_request.order_by(order_func(Note.name))


        notes = session.exec(sql_request).all()
        note_ids = [note.id for note in notes]
        histories_by_note = {}

        if note_ids:
            history_sql_request = select(History)
            history_sql_request = history_sql_request.where(History.original_note_id.in_(note_ids))

            history_rows = session.exec(history_sql_request)
            history_rows = history_rows.all()

            for h in history_rows:
                note_id = h.original_note_id

                if note_id not in histories_by_note:
                    histories_by_note[note_id] = []

                histories_by_note[note_id].append(h)

        return [
            {
                "id": note.id,
                "name": note.name,
                "description": note.description,
                "color": note.color,
                "start_time": note.start_time,
                "end_time": note.end_time,
                "status": note.status,
                "is_expired": note.end_time < datetime.utcnow(),
                "history": histories_by_note.get(note.id, []),
            } for note in notes
        ]
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/add_note")
def add_note(params:AddNoteParams, session:SqlSession):
    try:
        note = Note(**params.dict())

        session.add(note)
        session.commit()
        session.refresh(note)

        return note
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/modify_note")
def modify_note(params:ModifyNoteParams, session:SqlSession):
    try:
        note = session.get(Note, params.id)

        if (note is None or
            note.status == Note.NoteStatus.DELETE or
                note.status == Note.NoteStatus.HISTORY):
            raise HTTPException(status_code=404, detail="Note not found")

        old_history_note = Note(**note.model_dump(exclude={"id"}))
        old_history_note.id = None
        old_history_note.status = Note.NoteStatus.HISTORY

        data = params.model_dump(exclude_unset=True, exclude={"id"})
        for key, value in data.items():
            setattr(note, key, value)

        new_history_note = Note(**note.model_dump(exclude={"id"}))
        new_history_note.id = None
        new_history_note.status = Note.NoteStatus.HISTORY

        session.add(note)
        session.add(old_history_note)
        session.add(new_history_note)

        session.flush()

        history_record = History(
            original_note_id = note.id,
            last_note_id = old_history_note.id,
            new_note_id = new_history_note.id
        )

        session.add(history_record)

        session.commit()
        session.refresh(note)

        return note
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/delete_note")
def delete_note(params:DeleteNoteParams, session:SqlSession):
    try:
        note = session.get(Note, params.id)

        if (note is None or
            note.status == Note.NoteStatus.DELETE or
                note.status == Note.NoteStatus.HISTORY):
            raise HTTPException(status_code=404, detail="Note not found")

        note.status = Note.NoteStatus.DELETE

        histories = session.exec(select(History).where(History.original_note_id == note.id)).all()
        for history in histories:
            session.delete(history)

        session.commit()
        session.refresh(note)

        return {"message": f"Note{note.id} deleted"}
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/get_history")
def get_history(params:GetHistoryParams, session:SqlSession):
    try:
        original_note = aliased(Note)
        last_note = aliased(Note)
        new_note = aliased(Note)

        sql_request = (
            select(History, last_note, new_note)
            .join(original_note, original_note.id == History.original_note_id)
            .join(last_note, last_note.id == History.last_note_id)
            .join(new_note, new_note.id == History.new_note_id)
            .where(original_note.status == Note.NoteStatus.EXISTS)
        )

        if params.start_time is not None:
            sql_request = sql_request.where(History.update_time >= params.start_time)

        if params.end_time is not None:
            sql_request = sql_request.where(History.update_time < params.end_time)

        if params.search_line:
            sql_request = sql_request.where(
                or_(
                    last_note.name.contains(params.search_line),
                    new_note.name.contains(params.search_line),
                )
            )

        sort_column = new_note.name if params.sort_by == "name" else History.update_time
        order_func = desc if params.descending else asc
        sql_request = sql_request.order_by(order_func(sort_column), History.id)

        rows = session.exec(sql_request).all()

        def to_history_note(note:Note):
            return {
                "name":note.name,
                "description":note.description,
                "color":note.color,
                "start_time":note.start_time,
                "end_time":note.end_time,
            }

        return [
            {
                "id":history.id,
                "update_time":history.update_time,
                "original_note_id":history.original_note_id,
                "last_note":to_history_note(last),
                "new_note":to_history_note(new),
            } for history, last, new in rows
        ]
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/delete_history")
def delete_history(params:DeleteHistoryParams, session:SqlSession):
    try:
        record = session.get(History, params.id)

        if record is None:
            raise HTTPException(status_code=404, detail="History record not found")

        record_id = record.id
        snapshot_ids = [record.last_note_id, record.new_note_id]

        session.delete(record)
        session.flush()

        for snapshot_id in snapshot_ids:
            snapshot = session.get(Note, snapshot_id)

            if snapshot is not None and snapshot.status == Note.NoteStatus.HISTORY:
                session.delete(snapshot)

        session.commit()

        return {
            "id":record_id,
            "message":f"History record {record_id} deleted"
        }
    except HTTPException:
        raise
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
