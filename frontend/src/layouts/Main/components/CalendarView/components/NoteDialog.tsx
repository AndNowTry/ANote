import {Dialog, DialogContent, DialogTitle} from "@mui/material"
import type {CalendarEvent, CalendarInstanceApi} from "@svar-ui/react-calendar"



type NoteDialogProps = {
    current_api:CalendarInstanceApi | null
    mode:"select"|"add"|"edit"|"delete"
    id?:number
    event:Partial<CalendarEvent>
    close:() => void
}

export function NoteDialog({ current_api, mode, id, event, close }:NoteDialogProps)
{
    function save():void
    {
        close()
    }

    function update():void
    {
        close()
    }

    function remove():void
    {
        close()
    }

    return (
        <Dialog open onClose={close}>
            <DialogTitle>{"Редактирование"}</DialogTitle>

            <DialogContent>
                <pre>
                    {JSON.stringify(current_api, null, 2)}
                </pre>

                <pre>
                    {mode}
                </pre>

                <pre>
                    {id}
                </pre>

                <pre>
                    {JSON.stringify(event, null, 2)}
                </pre>
            </DialogContent>
        </Dialog>
    )
}