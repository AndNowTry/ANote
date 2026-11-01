export type NoteSnapshot = {
    name:string
    description:string
    color:string
    start:Date
    end:Date
}

export type FieldName = "name"|"description"|"color"|"start"|"end"

export type FieldChange = {
    field:FieldName
    before:string
    after:string
}



export const FIELD_LABELS:Record<FieldName, string> = {
    name:"Name",
    description:"Description",
    color:"Color",
    start:"Start",
    end:"End",
}



export function formatDateTime(date:Date):string
{
    return date.toLocaleString()
}



export function getChanges(last:NoteSnapshot, next:NoteSnapshot):FieldChange[]
{
    const changes:FieldChange[] = []

    if(last.name !== next.name)
    {
        changes.push({
            field:"name",
            before:last.name,
            after:next.name
        })
    }

    if(last.description !== next.description)
    {
        changes.push({
            field:"description",
            before:last.description,
            after:next.description
        })
    }

    if(last.color !== next.color)
    {
        changes.push({
            field:"color",
            before:last.color,
            after:next.color
        })
    }

    if(last.start.getTime() !== next.start.getTime())
    {
        changes.push({
            field:"start",
            before:formatDateTime(last.start),
            after:formatDateTime(next.start)
        })
    }

    if(last.end.getTime() !== next.end.getTime())
    {
        changes.push({
            field:"end",
            before:formatDateTime(last.end),
            after:formatDateTime(next.end)
        })
    }

    return changes
}
