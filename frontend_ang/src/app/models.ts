export interface Folder
{
  id: string
  name: string
  weekStart: string
}

export type CreateResult = 'ok'|'exists'|'invalid'

export interface Note
{
  id: number
  name: string
  folderId: string | null
  tags: string[]
}
