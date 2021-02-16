import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientResolverGuard } from 'src/app/guards/client-resolver.guard';

import { ClientFormComponent } from './client-form/client-form.component';
import { ClientListComponent } from './client-list/client-list.component';


const routes: Routes = [
  {
    path: 'new',
    component: ClientFormComponent,
    resolve: {
      client: ClientResolverGuard
    }
  },
  {
    path: 'edit/:id',
    component: ClientFormComponent,
    resolve: {
      client: ClientResolverGuard
    }
  },
  {
    path: '',
    component: ClientListComponent
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'client'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
