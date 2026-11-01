import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map } from 'rxjs'



export interface Currency 
{
  id:number
  code:string
  name:string
  rate:number
}

interface ApiRatesResponse 
{
  result:string
  base_code:string
  rates: Record<string,number>
}



const CODES = ['USD', 'EUR', 'GBP', 'CNY', 'JPY', 'KZT', 'TRY', 'CHF']

@Injectable({
  providedIn:'root'
})
export class CurrencyService 
{
  private readonly apiUrl = 'https://open.er-api.com/v6/latest/RUB'

  constructor(private http: HttpClient) {}

  getCurrencies():Observable<Currency[]> 
  {
    return this.http.get<ApiRatesResponse>(this.apiUrl).pipe(
      map(response => {
        const names = new Intl.DisplayNames(['ru'], { type: 'currency' })

        return CODES
          .filter(code => response.rates[code])
          .map((code, index) => ({
            id:index + 1,
            code,
            name:names.of(code) ?? code,
            rate:Number((1 / response.rates[code]).toFixed(2))
          }))
      })
    )
  }

  getCurrencyById(id:number):Observable<Currency>
  {
    return this.getCurrencies().pipe(
      map(list => {
        const currency = list.find(c => c.id === id)
        if (!currency) throw new Error('not found')
        return currency
      })
    )
  }
}