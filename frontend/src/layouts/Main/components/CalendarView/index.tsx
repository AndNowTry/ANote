import {Calendar, type CalendarEvent, type CalendarInstanceApi} from "@svar-ui/react-calendar"
import {useRef, useState} from "react"
import './styles/calendar.css'
import {NoteDialog} from "./components/NoteDialog.tsx"



const events = [
    {
        id: 1,
        start: new Date(2026, 8, 30, 9, 0),
        end: new Date(2026, 8, 30, 9, 30),
        text: "Standup",
    },
    {
        id: 2,
        start: new Date(2026, 8, 30, 11, 0),
        end: new Date(2026, 8, 30, 12, 0),
        text: "Созвон с командой",
    },
    {
        id: 3,
        start: new Date(2026, 8, 30, 14, 30),
        end: new Date(2026, 8, 30, 16, 0),
        text: "Код-ревью",
        color: "#e57373",
    },
]

type EventID = string|number

type SelectEventPayload = {
    id:EventID
    rawId?:EventID
    mode?:"series"|"single"|"following"
}

type AddEventPayload = {
    event:Partial<CalendarEvent>
    edit?:boolean
    id?:EventID
    rawId?:EventID
}

type UpdateEventPayload = {
    id:EventID
    rawId?:EventID
    event:Partial<CalendarEvent>
    mode?:"single" | "following"
}

type DialogState = {
    mode:"select"|"add"|"update"
    id?:number|string
    event?:Partial<CalendarEvent>
    resolve:(event: Partial<CalendarEvent> | null) => void
}

export function CalendarView()
{
    const api = useRef<CalendarInstanceApi|null>(null)
    const [dialog, setDialog] = useState<DialogState|null>(null)


    function onInit(apiFromCalendar:CalendarInstanceApi)
    {
        api.current = apiFromCalendar

        // @ts-ignore
        api.current.intercept("select-event", (payload:SelectEventPayload):Promise<boolean> => {
            return new Promise<boolean>((resolve) => {
                setDialog({
                    mode:"select",
                    id:payload.id,
                    resolve:():void => {
                        setDialog(null)
                        resolve(false)
                    }
                })
            })
        })

        // @ts-ignore
        api.current.intercept("add-event", (payload:AddEventPayload):Promise<boolean> => {
            return new Promise<boolean>((resolve) => {
                setDialog({
                    mode:"add",
                    event:payload.event,
                    resolve:(newEvent:Partial<CalendarEvent>|null):void => {
                        setDialog(null)
                        if(newEvent)
                        {
                            Object.assign(payload.event, newEvent)
                            resolve(true)
                        }
                        else
                        {
                            resolve(false)
                        }
                    }
                })
            })
        })

        api.current.intercept("delete-event",
            (payload:any):void => {
                console.log("delete", payload)
            }
        )

        // @ts-ignore
        api.current.intercept("update-event", (payload:UpdateEventPayload):Promise<boolean> => {
            return new Promise<boolean>((resolve) => {
                setDialog({
                    mode:"update",
                    id:payload.id,
                    event:payload.event,
                    resolve:(newEvent:Partial<CalendarEvent>|null):void => {
                        setDialog(null)
                        if(newEvent)
                        {
                            Object.assign(payload.event, newEvent)
                            resolve(true)
                        }
                        else
                        {
                            resolve(false)
                        }
                    }
                })
            })
        })

        api.current.intercept("move-event", (payload) => {
            return new Promise<boolean>((resolve) => {
                setDialog({
                    mode:"update",
                    id:payload.id,
                    event:payload.event,
                    resolve:(newEvent:Partial<CalendarEvent>|null):void => {
                        setDialog(null)
                        if(newEvent)
                        {
                            Object.assign(payload.event, newEvent)
                            resolve(true)
                        }
                        else
                        {
                            resolve(false)
                        }
                    }
                })
            })
        })
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
                mode={dialog.mode}
                id={dialog.id}
                event={dialog.event}
                resolve={dialog.resolve}
            />
        )}
    </>
    )
}