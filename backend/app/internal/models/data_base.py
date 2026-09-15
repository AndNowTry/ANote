from enum import Enum
from datetime import datetime
from sqlmodel import Field, SQLModel



class Note(SQLModel, table=True):
    class NoteStatus(str, Enum):
        ACTIVE = "active"
        DELETE = "delete"

    id:int|None = Field(default=None, primary_key=True)
    name:str
    description:str
    color:str
    start_time:datetime
    end_time:datetime
    status:NoteStatus = Field(default=NoteStatus.ACTIVE)


class History(SQLModel, table=True):
    id:int|None = Field(default=None, primary_key=True)
    update_time:datetime
    last_note_id:int = Field(foreign_key="note.id")
    new_note_id:int = Field(foreign_key="note.id")
