export const ANGULAR_URL: string = import.meta.env.VITE_ANGULAR_URL ?? "http://localhost:4200"


export function readNoteParam():number|null
{
    const value = new URLSearchParams(window.location.search).get("note")
    const id = value ? Number(value) : NaN

    return Number.isInteger(id) ? id : null
}


export function clearNoteParam():void
{
    const url = new URL(window.location.href)

    url.searchParams.delete("note")
    window.history.replaceState(null, "", url)
}
