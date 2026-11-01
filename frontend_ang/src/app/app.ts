import { Component, OnInit, signal } from '@angular/core'
import { RouterOutlet, RouterLink } from '@angular/router'
import { FormsModule, NgForm } from '@angular/forms'
import { Currency, CurrencyService } from './services/currency'



@Component({
  imports:[RouterOutlet, RouterLink, FormsModule],
  selector:'app-root',
  styleUrl:'./app.css',
  templateUrl:'./app.html',
})
export class App implements OnInit 
{
  currencies = signal<Currency[]>([])

  loading = signal(false)
  error = signal('')
  formError = signal('')

  currencyCode = ''
  currencyName = ''
  currencyRate:number | null = null

  private nextId = 1000

  constructor(private currencyService:CurrencyService) {}

  ngOnInit():void 
  {
    this.loadCurrencies()
  }

  loadCurrencies():void 
  {
    this.loading.set(true)
    this.error.set('')

    this.currencyService.getCurrencies().subscribe({
      next: (currencies) => {
        this.currencies.set(currencies)
        this.loading.set(false)
      },
      error: (err) => {
        console.error(err);
        this.error.set('Не удалось загрузить курсы валют')
        this.loading.set(false)
      }
    })
  }

  deleteCurrency(id:number):void 
  {
    this.currencies.update(list => list.filter(c => c.id !== id))
  }

  addCurrencyFromForm(form:NgForm):void 
  {
    if (form.invalid) return

    const code = this.currencyCode.trim().toUpperCase()
    const name = this.currencyName.trim()
    const rate = this.currencyRate

    if (rate === null || rate <= 0 || !Number.isFinite(rate)) return

    if(this.currencies().some(c => c.code === code)) 
    {
      this.formError.set(`Валюта ${code} уже есть в списке`)
      return
    }

    const newCurrency: Currency = { id: this.nextId, code, name, rate }

    this.currencies.update(list => [...list, newCurrency])
    this.nextId++
    this.formError.set('')

    form.resetForm({
      currencyCode: '',
      currencyName: '',
      currencyRate: null
    })
  }
}