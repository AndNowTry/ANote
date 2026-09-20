import logging
from datetime import datetime
import uvicorn
from typing import Annotated
from sqlmodel import Session, select, or_, asc, desc
from fastapi import FastAPI, Depends, HTTPException
from external.models.data_base import Note, History
from external.clients.database import create_db_and_tables, get_session
from external.models.request import AddNoteParams, ModifyNoteParams, DeleteNoteParams, DeleteHistoryParams, GetNotesParams



logger = logging.getLogger(__name__)
SqlSession = Annotated[Session, Depends(get_session)]
app = FastAPI()



@app.on_event("startup")
def on_startup():
    create_db_and_tables()



@app.get("/get_notes")
def get_notes(params: Annotated[GetNotesParams, Depends()], session: SqlSession):
    try:
        sql_request = select(Note).where(Note.status == Note.NoteStatus.EXISTS)

        if params.ids is None:
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

        old_history_note = note.deepcopy()
        old_history_note.id = None
        old_history_note.status = Note.NoteStatus.HISTORY

        data = params.model_dump(exclude_unset=True, exclude={"id"})
        for key, value in data.items():
            setattr(note, key, value)

        new_history_note = note.deepcopy()
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

        session.delete(select(History).where(note.id == History.original_note_id))
        session.commit()
        session.refresh(note)

        return {"message": f"Note{note.id} deleted"}
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/get_history")
def delete_note(params:DeleteHistoryParams, session:SqlSession):
    try:
        record = session.get(History, params.id)

        if record is None:
            raise HTTPException(status_code=404, detail="History record not found")

        session.delete(session.get(Note, record.last_note_id))
        session.delete(session.get(Note, record.new_note_id))

        session.delete(record)
        session.commit()
        session.refresh(record)

        return {"message": f"History record{record.id} deleted"}
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")


@app.post("/delete_history")
def delete_note(params:DeleteHistoryParams, session:SqlSession):
    try:
        record = session.get(History, params.id)

        if record is None:
            raise HTTPException(status_code=404, detail="History record not found")

        session.delete(session.get(Note, record.last_note_id))
        session.delete(session.get(Note, record.new_note_id))

        session.delete(record)
        session.commit()
        session.refresh(record)

        return {"message": f"History record{record.id} deleted"}
    except Exception as error:
        logger.exception(f"BD error: {error}")
        raise HTTPException(status_code=500, detail=f"BD error: {error}")



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
