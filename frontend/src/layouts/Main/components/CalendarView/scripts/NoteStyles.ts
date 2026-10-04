import type {CalendarEvent, EventContext} from "@svar-ui/react-calendar"



type paletteOption = {
    id:string,
    label:string,
    bg:string,
}

const PALETTE:paletteOption[] = [
    { id: "red", label: "Red", bg: "#c62828" },
    { id: "pink", label: "Pink", bg: "#ad1457" },
    { id: "purple", label: "Purple", bg: "#6a1b9a" },
    { id: "indigo", label: "Indigo", bg: "#283593" },
    { id: "blue", label: "Blue", bg: "#1565c0" },
    { id: "teal", label: "Teal", bg: "#00695c" },
    { id: "green", label: "Green", bg: "#2e7d32" },
    { id: "orange", label: "Orange", bg: "#ef6c00" },
    { id: "brown", label: "Brown", bg: "#4e342e" },
    { id: "gray", label: "Gray", bg: "#546e7a" },
]

const extraCalendarCss:string = PALETTE.map(
    ({ id, bg }) => `.ev-${id}, .ev-${id} > * { background-color: ${bg} !important; color: #fff; }`
).join("\n")

const eventCss = (ctx:EventContext):string =>
    `ev-${(ctx.event as CalendarEvent & { color?: string; description?: string }).color ?? "blue"}`



export {PALETTE, extraCalendarCss, eventCss}