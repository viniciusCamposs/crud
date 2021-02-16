import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TelephoneService {

  url: string = 'http://localhost:8080/crud/telephone/';



  constructor(
    private http: HttpClient
  ) { }

  deleteTelephone(idTelephone: number){
    return this.http.delete(this.url + idTelephone);
  }



}
