import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Client } from '../models/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  url:string = 'http://localhost:8080/crud/client/';

  constructor(
    private http: HttpClient
  ) { }

  saveClient(client: Client){
    return this.http.post<Client>(this.url, client, {responseType: 'text' as 'json'});
  }

  getAllClients(){
    return this.http.get<Client[]>(this.url);
  }

  deleteClient(idClient: number){
    return this.http.delete(this.url + idClient);
  }

  getClientByCpf(cpf: string){
    return this.http.get<boolean>(this.url + "cpf" + "/" + cpf);
  }

  getClientById(idClient: number){
    return this.http.get<Client>(this.url + "id/" + idClient);
  }

  updateClient(client: Client){
    return this.http.put<Client>(this.url, client, {responseType: 'text' as 'json'});
  }

  verifyIfCpfIsValid(cpf: string){
    return this.http.get<boolean>(this.url + "cpf" + "/valid/" + cpf);
  }

}
