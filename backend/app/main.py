from typing import Annotated
import uvicorn
from fastapi import FastAPI, Depends
import logging
from sqlmodel import Session
from backend.app.internal.clients.database import create_db_and_tables, get_session
from backend.app.internal.models.request import SearchNoteParams, AddNoteParams, ModifyNoteParams, DeleteNoteParams, DeleteHistoryParams



logger = logging.getLogger(__name__)
SqlSession = Annotated[Session, Depends(get_session)]
app = FastAPI()



@app.on_event("startup")
def on_startup():
    create_db_and_tables()



@app.get("/get_notes")
def get_notes(params:SearchNoteParams, session:SqlSession):
    logger.info("Hello: World")
    return {"Hello": "World"}

@app.post("/add_note")
def add_note(params:AddNoteParams, session:SqlSession):
    logger.info("Hello: World")
    return {"Hello": "World"}

@app.post("/modify_note")
def modify_note(params:ModifyNoteParams, session:SqlSession):
    logger.info("Hello: World")
    return {"Hello": "World"}

@app.post("/delete_note")
def delete_note(params:DeleteNoteParams, session:SqlSession):
    logger.info("Hello: World")
    return {"Hello": "World"}

@app.post("/delete_history")
def delete_note(params:DeleteHistoryParams, session:SqlSession):
    logger.info("Hello: World")
    return {"Hello": "World"}



if __name__ == '__main__':
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
