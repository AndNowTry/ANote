import {ChangeDetectionStrategy, Component, inject} from '@angular/core'
import {NotesService} from './notes.service'
import {FoldersService} from '../folders/folders.service'


@Component({
  selector: 'app-notes',
  templateUrl: './notes.html',
  styleUrl: './notes.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notes
{
  protected readonly service = inject(NotesService)
  protected readonly folders = inject(FoldersService)


  protected onSearch(event: Event):void
  {
    this.service.search.set((event.target as HTMLInputElement).value)
  }
}
