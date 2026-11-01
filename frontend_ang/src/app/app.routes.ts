import { Routes } from '@angular/router'
import { CurrencyDetail } from './services/currency-detail'


export const routes: Routes = [
  { path: 'currency/:id', component: CurrencyDetail }
]
