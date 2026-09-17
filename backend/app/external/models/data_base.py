from enum import Enum
from datetime import datetime
from sqlmodel import Field, SQLModel



class Note(SQLModel, table=True):
    class NoteStatus(str, Enum):
        EXISTS = "exists"
        HISTORY = "history"
        DELETE = "delete"

    id:int|None = Field(default=None, primary_key=True)
    name:str
    description:str
    color:str
    start_time:datetime
    end_time:datetime
    status:NoteStatus = Field(default=NoteStatus.EXISTS)


class History(SQLModel, table=True):
    id:int|None = Field(default=None, primary_key=True)
    update_time:datetime = Field(default=datetime)
    original_note_id:int = Field(foreign_key="note.id", ondelete="CASCADE")
    last_note_id:int = Field(foreign_key="note.id", unique=True, ondelete="CASCADE")
    new_note_id:int = Field(foreign_key="note.id", unique=True, ondelete="CASCADE")
