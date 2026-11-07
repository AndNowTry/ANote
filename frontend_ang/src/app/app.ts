import { Component } from '@angular/core'
import { Folders } from './folders/folders'
 

@Component({
  selector: 'app-root',
  imports: [Folders],
  template: '<app-folders />',
})
export class App {}