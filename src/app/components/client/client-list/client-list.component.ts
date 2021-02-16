import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { Client } from 'src/app/models/Client';

import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  firstName!: string; 
  bsModalRef!: BsModalRef;

  constructor(
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.listAllClients();
  }

  listAllClients(){
    let resp = this.clientService.getAllClients();
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data: Client[]) => this.clients = data,
      (erro: Error) => console.error(erro) 
    )
  }

  deleteClient(idClient: number){
    let resp = this.clientService.deleteClient(idClient);
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data) => this.listAllClients(),
      (erro: Error) => console.error(erro)
    )

    this.listAllClients();
  }

  onEdit(id: number){
    this.router.navigate(['edit', id], { relativeTo: this.route })
  }

  searchPacient(){
    if(this.firstName != ""){
      this.clients = this.clients.filter(res=>{
        return res.name.toLocaleLowerCase().match(this.firstName.toLocaleLowerCase());
      })
    }else{
      this.listAllClients();
    }
  }
}
