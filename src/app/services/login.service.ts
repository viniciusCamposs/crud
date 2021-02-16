import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  url: String = 'http://localhost:8080/crud/login/';

  constructor(
    private http: HttpClient
  ) { }

  verifyLogin(user: string, password: string){
    return this.http.get<boolean>(this.url + user + "/" + password);
  }

}
