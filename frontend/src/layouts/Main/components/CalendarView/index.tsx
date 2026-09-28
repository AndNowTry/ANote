import {Calendar, type CalendarEvent, type CalendarInstanceApi} from "@svar-ui/react-calendar"
import {useRef, useState} from "react"
import './styles/calendar.css'
import {NoteDialog} from "./components/NoteDialog.tsx"



const events = [
    {
        id: 1,
        start: new Date(2026, 4, 5, 9, 0),
        end: new Date(2026, 4, 5, 10, 0),
        text: "Standup",
    },
]

type DialogState = {
    mode:"select"|"add"|"edit"|"delete"
    id?:number
    event:Partial<CalendarEvent>
}

type AddEventPayload = {
    event:Partial<CalendarEvent>
    edit?:boolean
    id?:number
    rawId?:number
}

type UpdateEventPayload = {
    id:number
    rawId?:number
    event:Partial<CalendarEvent>
    mode?:"single"|"following"
}


export function CalendarView()
{
    const api = useRef<CalendarInstanceApi|null>(null)
    const [dialog, setDialog] = useState<DialogState|null>(null)


    function onInit(apiFromCalendar: CalendarInstanceApi)
    {
        api.current = apiFromCalendar

        apiFromCalendar.intercept("select-event",
            ((payload:AddEventPayload) => {
                setDialog({mode: "select", event: payload.event})
                return false
            }) as any
        )

        apiFromCalendar.intercept("add-event",
            ((payload:AddEventPayload) => {
                setDialog({mode: "add", event: payload.event})
                return false
            }) as any
        )

        apiFromCalendar.intercept("update-event",
            ((payload:UpdateEventPayload) => {
                setDialog({mode: "edit", id: payload.id, event: payload.event})
                return false
            }) as any
        )

        apiFromCalendar.intercept("delete-event",
            ((payload:UpdateEventPayload) => {
                setDialog({mode: "delete", id: payload.id, event: payload.event})
                return false
            }) as any
        )
    }

    return (
    <>
        <Calendar
            init={onInit}
            events={events}
            date={new Date()}
            view={"week"}
            views={["day", "week"]}
        />

        {dialog && (
            <NoteDialog
                current_api={api.current}
                mode={dialog.mode}
                id={dialog.id}
                event={dialog.event}
                close={() => setDialog(null)}
            />
        )}
    </>
    )
}