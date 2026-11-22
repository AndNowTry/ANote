import {computed, inject, Injectable, signal} from '@angular/core'
import {FoldersService} from '../folders/folders.service'
import {Note} from '../models'


@Injectable({providedIn: 'root'})
export class NotesService
{
  private readonly foldersService = inject(FoldersService)

  readonly search = signal('')
  readonly selectedTags = signal<string[]>([])

  readonly highlightedId = signal<number | null>(this.readNoteParam())

  private readonly all = signal<Note[]>(this.mock())


  readonly tags = computed(() => [...new Set(this.all().flatMap((note) => note.tags))].sort())


  readonly notes = computed(() => {
    const folderId = this.foldersService.selectedId()
    const tags = this.selectedTags()
    const query = this.search().trim().toLowerCase()

    return this.all().filter((note) =>
      (folderId === null || note.folderId === folderId) &&
      tags.every((tag) => note.tags.includes(tag)) &&
      note.name.toLowerCase().includes(query),
    )
  })


  toggleTag(tag: string):void
  {
    this.selectedTags.update((tags) =>
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    )
  }

  clearFilters():void
  {
    this.search.set('')
    this.selectedTags.set([])
    this.foldersService.selectedId.set(null)
  }


  private mock():Note[]
  {
    const folders = this.foldersService.folders()
    const folderAt = (index: number): string | null => folders[index % folders.length]?.id ?? null

    return [
      {
        id: 1,
        name: 'Созвон с командой',
        folderId: folderAt(0),
        tags: ['работа']
      },
      {
        id: 2,
        name: 'Купить продукты',
        folderId: folderAt(0),
        tags: ['личное', 'срочно']
      },
      {
        id: 3,
        name: 'Ревью PR',
        folderId: folderAt(1),
        tags: ['работа', 'срочно']
      },
      {
        id: 4,
        name: 'План на неделю',
        folderId: folderAt(1),
        tags: ['работа', 'идеи']
      },
      {
        id: 5,
        name: 'Идеи для проекта',
        folderId: folderAt(2),
        tags: ['идеи']
      },
      {
        id: 6,
        name: 'Отчет по спринту',
        folderId: folderAt(3),
        tags: ['работа']
      },
    ]
  }

  private readNoteParam():number|null
  {
    const value = new URLSearchParams(window.location.search).get('note')
    const id = value === null ? NaN : Number(value)

    return Number.isInteger(id) ? id : null
  }
}

