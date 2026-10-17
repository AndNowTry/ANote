import {create} from "zustand"
import {type FieldChange, getChanges, type NoteSnapshot} from "./diff.ts"
import {api} from "../../../../../plugins/axios.ts"



export function toServer(value:Date|string):string
{
    return new Date(value).toISOString().slice(0, 19)
}

export function fromServer(value:string):Date
{
    return new Date(/(Z|[+-]\d\d:?\d\d)$/i.test(value) ? value : `${value}Z`)
}

function dayStart(value:string, addDays:number):Date
{
    const date = new Date(`${value}T00:00:00`)
    date.setDate(date.getDate() + addDays)
    return date
}



export type HistorySort = "time_desc"|"time_asc"|"name_asc"|"name_desc"

export type HistoryFilters = {
    search:string
    dateFrom:string
    dateTo:string
    sort:HistorySort
}

export type HistoryItem = {
    id:number
    noteId:number
    updateTime:Date
    last:NoteSnapshot
    next:NoteSnapshot
    changes:FieldChange[]
}

type HistoryState = HistoryFilters & {
    items:HistoryItem[]
    loading:boolean
    selected:HistoryItem|null
    setFilters:(patch: Partial<HistoryFilters>) => void
    select:(item: HistoryItem | null) => void
    load:() => Promise<void>
    remove:(item: HistoryItem) => Promise<void>
}

type NoteDto = {
    name:string
    description:string
    color:string
    start_time:string
    end_time:string
}

type HistoryDto = {
    id:number
    update_time:string
    original_note_id:number
    last_note:NoteDto
    new_note:NoteDto
}



function toSnapshot(note:NoteDto):NoteSnapshot
{
    return {
        name:note.name,
        description:note.description,
        color:note.color,
        start:fromServer(note.start_time),
        end:fromServer(note.end_time),
    }
}

function toItem(dto:HistoryDto):HistoryItem
{
    const last = toSnapshot(dto.last_note)
    const next = toSnapshot(dto.new_note)

    return {
        id:dto.id,
        noteId:dto.original_note_id,
        updateTime:fromServer(dto.update_time),
        last,
        next,
        changes:getChanges(last, next),
    }
}



function hasChanges(item:HistoryItem):boolean
{
    return item.changes.length > 0
}




let lastRequest = 0


export const useHistoryStore = create<HistoryState>((set, get) => ({
    items:[],
    loading:false,
    selected:null,
    search:"",
    dateFrom:"",
    dateTo:"",
    sort:"time_desc",

    setFilters:(patch) => {
        const current = get()
        const keys = Object.keys(patch) as (keyof HistoryFilters)[]

        if(keys.every((key) => patch[key] === current[key]))
        {
            return
        }

        set(patch)
        void get().load()
    },

    select:(item) => set({selected: item}),

    load:async () => {
        const { search, dateFrom, dateTo, sort } = get()
        const requestId = ++lastRequest

        set({loading: true})

        try
        {
            const { data } = await api.post<HistoryDto[]>("/get_history", {
                search_line:search.trim() || undefined,
                start_time:dateFrom ? toServer(dayStart(dateFrom, 0)) : undefined,
                end_time:dateTo ? toServer(dayStart(dateTo, 1)) : undefined,
                sort_by:sort.startsWith("name") ? "name" : "time",
                descending:sort.endsWith("desc"),
            })

            if(requestId !== lastRequest)
            {
                return
            }

            set({items:data.map(toItem).filter(hasChanges)})
        }
        catch (error)
        {
            console.error("Load history error:", error)
        }
        finally
        {
            if(requestId === lastRequest)
            {
                set({loading: false})
            }
        }
    },

    remove:async (item) => {
        try
        {
            await api.post("/delete_history", {id: item.id})
            set({selected: null})
            await get().load()
        }
        catch(error)
        {
            console.error("Delete history error:", error)
        }
    },
}))
