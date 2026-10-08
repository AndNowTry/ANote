import {RestDataProvider, type CalendarEvent} from "@svar-ui/react-calendar"
import {api} from "../../../../../plugins/axios.ts"



type NoteRecord = {
    id: number
    name: string
    description: string | null
    color: string | null
    start_time: string
    end_time: string
}



const dateToServer = (value:Date|string):string => new Date(value).toISOString().slice(0, 19)
const dateFromServer = (value: string):Date => new Date(/(Z|[+-]\d\d:?\d\d)$/i.test(value) ? value : `${value}Z`)



function noteToEvent(note:NoteRecord):CalendarEvent
{
    return {
        id: note.id,
        text: note.name,
        description: note.description ?? "",
        color: note.color ?? "blue",
        start: dateFromServer(note.start_time),
        end: dateFromServer(note.end_time),
    }
}



function noteToPayload(event:Record<string,any>={}):Record<string,unknown>
{
    const payload:Record<string,unknown> = {}

    if ("text" in event) payload.name = event.text ?? ""
    if ("description" in event) payload.description = event.description ?? ""
    if ("color" in event) payload.color = event.color
    if (event.start) payload.start_time = dateToServer(event.start)
    if (event.end) payload.end_time = dateToServer(event.end)

    return payload
}


class NoteProvider extends RestDataProvider
{
    constructor()
    {
        super("")
    }

    async getData():Promise<CalendarEvent[]>
    {
        const {data} = await api.get<NoteRecord[]>("/get_notes")
        return data.map(noteToEvent)
    }

    getHandlers():any
    {
        async function modify(data:any)
        {
            await api.post("/modify_note", {id:data.id, ...noteToPayload(data.event)})
        }

        return {
            "add-event": {
                ignoreID:true,
                handler:async (data: any) => {
                    const {data: note} = await api.post("/add_note", {
                        name: "",
                        description: "",
                        color: "blue",
                        ...noteToPayload(data.event),
                    })

                    return {id: note.id}
                },
            },
            "update-event": {
                debounce: 500,
                handler: modify,
            },
            "move-event": {
                handler: modify,
            },
            "delete-event": {
                handler: async(data: any) => {
                    await api.post("/delete_note", {id: data.id})
                },
            },
        }
    }
}


export const noteProvider = new NoteProvider()
