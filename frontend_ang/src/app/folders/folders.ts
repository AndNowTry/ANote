import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core'
import { FoldersService } from './folders.service'
import { Folder } from './models'
import { weekRange } from './week'


@Component({
  selector:'app-folders',
  templateUrl:'./folders.html',
  styleUrl:'./folders.css',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class Folders 
{
  protected readonly service = inject(FoldersService)

  protected readonly editingId = signal<string | null>(null)
  protected readonly draft = signal('')
  protected readonly error = signal('')

  protected readonly range = weekRange


  protected onSearch(event:Event):void 
  {
    this.service.search.set((event.target as HTMLInputElement).value)
  }

  protected create(week:string):void 
  {
    const result = this.service.create(week)

    this.error.set(
      result === 'invalid' ? 'Выбери неделю' :
      result === 'exists' ? 'Папка для этой недели уже есть' :
      '',
    )
  }

  protected startRename(folder:Folder):void 
  {
    this.editingId.set(folder.id)
    this.draft.set(folder.name)
  }

  protected onDraft(event:Event):void 
  {
    this.draft.set((event.target as HTMLInputElement).value)
  }

  protected saveRename():void 
  {
    const id = this.editingId()
    if (id) this.service.rename(id, this.draft())

    this.editingId.set(null)
  }

  protected cancelRename():void 
  {
    this.editingId.set(null)
  }

  protected remove(folder: Folder):void 
  {
    if(confirm(`Удалить папку "${folder.name}"?`)) 
    {
      this.service.remove(folder.id)
    }
  }
}
