import { Component } from '@angular/core'
import { Folders } from './folders/folders'
import { Notes } from './notes/notes'


@Component({
  selector: 'app-root',
  imports: [Folders, Notes],
  template: `
    <div class="layout">
      <app-folders />
      <app-notes />
    </div>
  `,
  styles: `
    .layout {
      display: grid;
      grid-template-columns: minmax(300px, 420px) 1fr;
      max-width: 1100px;
      margin: 0 auto;
    }
    @media (max-width: 800px) {
      .layout {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class App {}
