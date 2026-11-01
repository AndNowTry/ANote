import { Component, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Currency, CurrencyService } from './currency'


@Component({
  selector: 'app-currency-detail',
  templateUrl: './currency-detail.html'
})
export class CurrencyDetail implements OnInit
{
  private route = inject(ActivatedRoute)
  private currencyService = inject(CurrencyService)

  currency = signal<Currency | null>(null)
  loading = signal(true)
  error = signal('')

  ngOnInit():void
  {
    this.route.paramMap.subscribe(params =>
    {
      const id = Number(params.get('id'))

      this.loading.set(true)
      this.error.set('')
      this.currency.set(null)

      this.currencyService.getCurrencyById(id).subscribe({
        next: (c) => {
          this.currency.set(c)
          this.loading.set(false)
        },
        error: () => {
          this.error.set('Валюта не найдена')
          this.loading.set(false)
        }
      })
    })
  }
}
