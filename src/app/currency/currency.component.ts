import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Currency } from './currency';

import { FormBuilder } from '@angular/forms';
import { Rate } from './rate';


@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css']
})
export class CurrencyComponent implements OnInit {
  selectedCurrencyFrom:string = "";
  selectedCurrencyTo:string = "";
  convertedCurrency:number;
  convertedSymbol:string;

  convertForm = this.formBuilder.group({
    value:0,
    currencyFrom:"",
    currencyTo:""
  })

  currencies: Currency[] = [
    new Currency("Euro", "E", "EUR"),
    new Currency("Dollar", "$", "USD"),
    new Currency("Ghanaian Cedis", "GHc", "GHS"),
  ];

  conversionRates: Rate[] = [
    new Rate("EUR", "USD", 1.21),
    new Rate("EUR", "GHS", 6.98),
    new Rate("USD", "EUR", 0.83),
    new Rate("USD", "GHS", 5.78),
    new Rate("GHS", "USD", 0.17),
    new Rate("GHS", "EUR", 0.14),
  ]

  constructor(private httpClient:HttpClient, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getCurrencies();
  }

  // /api/v7/convert?q=USD_PHP,PHP_USD&compact=ultra&apiKey=[YOUR_API_KEY]

  getConversionRate(currencyFrom:string, currencyTo:string){
    // this.httpClient.get<any>(`https://free.currconv.com/api/v7/convert?q=${this.selectedCurrencyFrom}_${this.selectedCurrencyTo}&compact=ultra&apiKey=f0278d6730125acbf8b4`).subscribe(
    //   response => {
    //     console.log(response);
    //   }
    // )
    for(let rate of this.conversionRates){
      if(rate.currencyFrom === currencyFrom && rate.currencyTo === currencyTo){
        return rate.rate;
      }
    }
  }

  getCurrencies(){
    // this.httpClient.get<any>('https://free.currconv.com/api/v7/currencies?apiKey=f0278d6730125acbf8b4').subscribe(
    //   response => {
    //     for(let key in response['results']){
    //       this.currencies.push(new Currency(response['results'][key]['currencyName'],
    //       response['results'][key]['currencySymbol'],
    //       response['results'][key]['id']));
    //     }
    //   }
    // )

  }

  getSymbol(){
    console.log(this.selectedCurrencyTo.slice(0,3));
  }

  onConvert():void{
    let rate:number = this.getConversionRate(this.convertForm.value.currencyFrom.slice(0,3),this.convertForm.value.currencyTo.slice(0,3));
    this.convertedCurrency = this.convertForm.value.value*rate;
    for(let currency of this.currencies){
      if(this.convertForm.value.currencyTo.slice(0,3) === currency.id){
        this.convertedSymbol = currency.currencySymbol;
      }
    }
  }
}
