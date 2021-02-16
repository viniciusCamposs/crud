import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';
import { LoginService } from 'src/app/services/login.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  showPassword: boolean = false;
  loginValidation:boolean = false;
  bsModalRef!: BsModalRef;
  submitted: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private loginService: LoginService,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {

    this.form = this.formBuilder.group({
      user: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      password: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });

  }

  doLogin(condition: boolean){
    if((this.form.valid) && (condition)){
      this.authService.login();
    }
  }

  changePasswordView(){
    this.showPassword = !this.showPassword;
  }

  verifyLogin(){
    let resp = this.loginService.verifyLogin(this.form.get('user')?.value, this.form.get('password')?.value);
    return resp.pipe(
      take(1)
    )
    .subscribe(
      (data: boolean) => this.doLogin(data),
      (erro: Error) => {console.error(erro), this.showErrorListClients()}
    )

   }

   showErrorListClients(){
    this.bsModalRef = this.modalService.show(AlertModalComponent);
    this.bsModalRef.content.type = 'danger';
    this.bsModalRef.content.message = 'Could not login. Please check your connection to the server.';
  }

  hasError(field: string){
    return this.form.get(field)?.errors;
  }

}
