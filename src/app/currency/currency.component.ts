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

  currencies: Currency[] = [];



  // currencies: Currency[] = [
  //   new Currency("Euro", "E", "EUR"),
  //   new Currency("Dollar", "$", "USD"),
  //   new Currency("Ghanaian Cedis", "GHc", "GHS"),
  // ];

  // conversionRates: Rate[] = [
  //   new Rate("EUR", "USD", 1.21),
  //   new Rate("EUR", "GHS", 6.98),
  //   new Rate("USD", "EUR", 0.83),
  //   new Rate("USD", "GHS", 5.78),
  //   new Rate("GHS", "USD", 0.17),
  //   new Rate("GHS", "EUR", 0.14),
  //   new Rate("GHS", "GHS", 1),
  //   new Rate("EUR", "EUR", 1),
  //   new Rate("USD", "USD", 1),
  // ]

  constructor(private httpClient:HttpClient, private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.getCurrencies();
  }


  getConversionRate(){
    this.httpClient.get<any>(`https://free.currconv.com/api/v7/convert?q=${this.convertForm.value.currencyFrom.slice(0,3)}_${this.convertForm.value.currencyTo.slice(0,3)}&compact=ultra&apiKey=f0278d6730125acbf8b4`).subscribe(
      response => {
        this.convertedCurrency = this.convertForm.value.value * response[this.convertForm.value.currencyFrom.slice(0,3)+'_'+this.convertForm.value.currencyTo.slice(0,3)];
        for(let currency of this.currencies){
          if(this.convertForm.value.currencyTo.slice(0,3) === currency.id){
            this.convertedSymbol = currency.currencySymbol;
            if(this.convertedSymbol === undefined){
              this.convertedSymbol = currency.id;
            }
          }
        }
      }
    )
  }

  getCurrencies(){
    this.httpClient.get<any>('https://free.currconv.com/api/v7/currencies?apiKey=f0278d6730125acbf8b4').subscribe(
      response => {
        for(let key in response['results']){
          this.currencies.push(new Currency(response['results'][key]['currencyName'],
          response['results'][key]['currencySymbol'],
          response['results'][key]['id']));
        }
      }
    )
  }

  // onConvert():void{
  //   console.log(this.convertForm.value.currencyFrom.slice(0,3));
  //   console.log(this.convertForm.value.currencyTo.slice(0,3));

  //   let rate:any = this.getConversionRate(this.convertForm.value.currencyFrom.slice(0,3),this.convertForm.value.currencyTo.slice(0,3));
  //   this.convertedCurrency = this.convertForm.value.value*rate;
  //   for(let currency of this.currencies){
  //     if(this.convertForm.value.currencyTo.slice(0,3) === currency.id){
  //       this.convertedSymbol = currency.currencySymbol;
  //     }
  //   }
  // }
}
