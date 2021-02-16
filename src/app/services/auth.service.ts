import { Injectable, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: boolean = false;

  showMenuEmitter = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) { }

  login(){

      this.auth= true;
    
      this.showMenuEmitter.emit(true);

      this.router.navigate(['/client']);
  }

  logout(){
    this.auth = false;

    this.showMenuEmitter.emit(false);

    this.router.navigate(['/']);
  }

  authClient(): boolean{
    return this.auth;
  }


}
