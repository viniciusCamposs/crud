import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Client } from '../models/Client';
import { ClientService } from '../services/client.service';

@Injectable({
  providedIn: 'root'
})
export class ClientResolverGuard implements Resolve<Client> {

  constructor(
    private clientService: ClientService
  ){

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Client>{

    if(route.params && route.params['id']){
      return this.clientService.getClientById(route.params['id']);
    }

    return of({
      idClient: 0,
      name: '',
      cpf: '',
      dt_inc: '',
      adresses: [],
      telephones: []
    });
    };

  
}


