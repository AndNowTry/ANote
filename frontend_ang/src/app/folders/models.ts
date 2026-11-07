export interface Folder 
{
  id: string
  name: string
  weekStart: string
}

export type CreateResult = 'ok' | 'exists' | 'invalid'
