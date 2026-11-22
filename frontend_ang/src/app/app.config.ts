import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core'
import { provideClientHydration } from '@angular/platform-browser'
import { provideHttpClient, withFetch } from '@angular/common/http'



export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(),
    provideHttpClient(withFetch())
  ]
}


export const REACT_APP_URL = 'http://localhost:5173'

export function reactNoteUrl(id:number):string
{
  return `${REACT_APP_URL}/?note=${id}`
}
