import { Injectable, computed, signal } from '@angular/core'
import { CreateResult, Folder } from './models'
import { defaultWeekName, weekId, weekStart } from './week'



const WEEKS_COUNT = 4 



@Injectable({ providedIn: 'root' })
export class FoldersService 
{
  readonly search = signal('')

  private readonly all = signal<Folder[]>(this.defaultFolders())

  readonly folders = computed(() => {
    const query = this.search().trim().toLowerCase()

    return this.all()
      .filter((folder) => folder.name.toLowerCase().includes(query))
      .sort((a, b) => b.weekStart.localeCompare(a.weekStart))
  })

  readonly total = computed(() => this.all().length)


  create(id:string):CreateResult 
  {
    const start = weekStart(id)
    if(!start) return 'invalid'
    if(this.all().some((folder) => folder.id === id)) return 'exists'

    this.all.update((folders) => [
      ...folders, {
        id, 
        name:defaultWeekName(id), 
        weekStart:start
      }
    ])
    return 'ok'
  }

  rename(id:string, name:string):void 
  {
    const clean = name.trim()

    if (!clean) return

    this.all.update((folders) =>
      folders.map((folder) => (folder.id === id ? {...folder, name: clean} : folder)),
    )
  }

  remove(id: string):void 
  {
    this.all.update((folders) => folders.filter((folder) => folder.id !== id))
  }


  private defaultFolders():Folder[] 
  {
    const result:Folder[] = []
    const now = new Date()

    for(let i = 0; i < WEEKS_COUNT; i++) 
    {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i * 7)
      const id = weekId(date)
      const start = weekStart(id)

      if(start) result.push({
        id, 
        name:defaultWeekName(id), 
        weekStart:start
      })
    }

    return result
  }
}