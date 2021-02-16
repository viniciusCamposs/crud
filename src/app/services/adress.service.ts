import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdressService {

  url: string = "http://localhost:8080/crud/adress/";

  constructor(
    private http: HttpClient
  ) { }

  deleteAdress(idAdress: number){
    return this.http.delete(this.url + idAdress);
  }

}
