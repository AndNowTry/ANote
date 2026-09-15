from datetime import datetime
from pydantic import BaseModel, model_validator



class SearchNoteParams(BaseModel):
    id:int|None = None
    search_line:str|None = None

    @model_validator(mode="after")
    def check_at_least_one(self):
        if all(value is None for value in [
            self.id,
            self.search_line
        ]):
            raise ValueError("Id or search_line must be indicated")
        return self


class AddNoteParams(BaseModel):
    name:str
    description:str
    color:str
    start_time:datetime
    end_time:datetime


class ModifyNoteParams(BaseModel):
    id:int
    name:str|None = None
    description:str|None = None
    color:str|None = None
    start_time:datetime|None = None
    end_time:datetime|None = None

    @model_validator(mode="after")
    def check_at_least_one(self):
        if all(value is None for value in [
            self.name,
            self.description,
            self.color,
            self.start_time,
            self.end_time
        ]):
            raise ValueError("One must be indicated in (name, description, color, start_time, end_time)")
        return self


class DeleteNoteParams(BaseModel):
    id:int


class DeleteHistoryParams(BaseModel):
    id:int