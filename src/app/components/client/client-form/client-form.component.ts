import { Component, OnInit} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { take } from 'rxjs/operators';
import { Adress } from 'src/app/models/Adress';

import { Client } from 'src/app/models/Client';
import { Telephone } from 'src/app/models/Telephone';
import { AdressService } from 'src/app/services/adress.service';
import { ClientService } from 'src/app/services/client.service';
import { CepService } from 'src/app/services/consulta-cep.service';
import { TelephoneService } from 'src/app/services/telephone.service';
import { AlertModalComponent } from 'src/app/shared/alert-modal/alert-modal.component';


@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {

  submitted: boolean = false;
  form!: FormGroup;
  client: Client = new Client();
  validCpf!: boolean;
  telephones!: FormArray;
  adresses!: FormArray;
  bsModalRef!: BsModalRef;
  
  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private consultaCep: CepService,
    private route: ActivatedRoute,
    private adressService: AdressService,
    private modalService: BsModalService,
    private router: Router,
    private telephoneService: TelephoneService
  ) { }

  ngOnInit(): void {

    const client = this.route.snapshot.data['client'];

    this.form = this.formBuilder.group({
      idClient: [null],
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(70)]],
      cpf: [null, [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      dt_inc: [null],
      adresses: this.formBuilder.array([ this.createAdress()]),
      telephones: this.formBuilder.array([ this.createTelephone() ])
    })

    if((client.adresses.length != 0) && (client.telephones.length != 0)){
      this.updateForm(client);
    }

  }

  updateForm(client: Client){
    this.form.patchValue({
      idClient: client.idClient,
      name: client.name,
      cpf: client.cpf,
      dt_inc: client.dt_inc
    });

    this.form.setControl('adresses', this.setExistingAdresses(client.adresses));
    this.form.setControl('telephones', this.setExistingTelephones(client.telephones));
  }



  setExistingAdresses(adressesSet: Adress[]): FormArray{
    const formArray = new FormArray([]);
    adressesSet.forEach(s => {
      formArray.push(this.formBuilder.group({
        idAdress: s.idAdress,
        cep: s.cep,
        number: s.number,
        complement: s.complement,
        street: s.street,
        neighborhood: s.neighborhood,
        city: s.city,
        state: s.state
        }));
        
      });
      return formArray;
  }

  setExistingTelephones(telephonesSet: Telephone[]): FormArray{
    const formArray = new FormArray([]);
    telephonesSet.forEach(s => {
      formArray.push(this.formBuilder.group({
        idTelephone: s.idTelephone,
        ddd: s.ddd,
        telNumber: s.telNumber,
        type: s.type
      }));
    });
    return formArray;
  }

  /****************************** ADD/REMOVE ADRESS IN FORM ************************************/

  addAdressInForm(){
    this.adresses = this.getAdressFormGroup();
    this.adresses.push(this.createAdress());
  }

  deleteAdressInForm(index: number){
    if(!this.verifyIfisUpdateOrLogin()){
      this.adresses.removeAt(index);
    }else{
      for(let i=0; i <= index; i++){
        this.adresses = this.getAdressFormGroup();
      }
      this.deleteAdress(this.getAdressFormGroup().controls[index].value.idAdress);
      console.log(this.getAdressFormGroup().controls[index]);
      this.adresses.removeAt(index);
      this.showAdressDeleted();
    }
  }

  /****************************** ADD/REMOVE TELEPHONE IN FORM ************************************/

  addTelephoneInForm(){
    this.telephones = this.getTelephoneFormGroup();
    this.telephones.push(this.createTelephone());
  }
  
  deleteTelephoneInForm(index: number){
    if(!this.verifyIfisUpdateOrLogin()){
      this.telephones.removeAt(index);
    }else{
      for(let i=0; i <= index; i++){
        this.telephones = this.getTelephoneFormGroup();
      }
      this.deleteTelephone(this.getTelephoneFormGroup().controls[index].value.idTelephone);
      this.telephones.removeAt(index);
      this.showTelephoneDeleted();
    }
  }

  /****************************** HTTP REQUEST ************************************/



  updateClient(client: Client): void{
    let resp = this.clientService.updateClient(client);
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data: Client) => console.log(data),
      (erro: Error) => console.error(erro)
    )
  }

  deleteAdress(index: number){
    let resp = this.adressService.deleteAdress(index);
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data) => console.log(data),
      (erro) => console.error(erro)
    )
  }

  deleteTelephone(index: number){
    let resp = this.telephoneService.deleteTelephone(index);
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data) => console.log(data),
      (erro) => console.error(erro)
    )
  }

  verifyCpf(condicao: boolean): void{
    if(condicao == true){
      let resp = this.clientService.getClientByCpf(this.form.get('cpf')?.value);
      resp.pipe(
        take(1)
      )
      .subscribe(
        (data: boolean) => this.onSubmit(data),
        (erro: Error) => console.error(erro)
      )
    }else{
      this.showCpfIsntValid();
    }
  }

  verifyIfCpfIsValid(){
    let resp = this.clientService.verifyIfCpfIsValid(this.form.get('cpf')?.value);
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data: boolean) => this.verifyCpf(data),
      (erro: Error) => console.error(erro)
    )
  }

  saveCllient(): void{
    let resp = this.clientService.saveClient(this.getClientValue());
    resp.pipe(
      take(1)
    )
    .subscribe(
      (data: Client) => console.log(data),
      (erro: Error) => console.error(erro)
    )
  }

  private getClientValue(): Client{

    this.client.name = this.form.get('name')?.value;
    this.client.cpf = this.form.get('cpf')?.value;
    this.client.adresses = this.form.get('adresses')?.value;
    this.client.telephones = this.form.get('telephones')?.value;

    return this.client;
  }

  /****************************** CAPTURE ERRORS ************************************/

  hasError(field: string){
    return this.form.get(field)?.errors;
  }

  hasErrorInFormArray(name: any, field: string){
    return name.get(field)?.errors;
  }

  teste(index: number, field: string){
    console.log(this.getAdressFormGroup().controls[index].get('cep')?.errors);
  }

  /****************************** GET FORM GROUP (ADRESS/TELEPHONE) ************************************/

  getAdressFormGroup(): FormArray{
    return this.form.get('adresses') as FormArray;
  }

  getTelephoneFormGroup(): FormArray{
    return this.form.get('telephones') as FormArray;
  }

  /****************************** CREATE FORM GROUP (ADRESS/TELEPHONE) ************************************/
  createAdress(): FormGroup{
    return this.formBuilder.group({
      idAdress: [''],
      cep: ['', [Validators.required, Validators.minLength(8),Validators.maxLength(8)]],
      number: ['', [Validators.required, Validators.maxLength(10)]],
      complement: [''],
      street: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      neighborhood: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      city: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    })
  }

  createTelephone(): FormGroup{
    return this.formBuilder.group({
      idTelephone: [''],
      ddd: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
      telNumber: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      type: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]]
    })
  }


  /****************************** FORM BUTTONS ************************************/

  onSubmit(condition: boolean){
    this.submitted = true;
    if(this.form.valid){
      if(!this.form.value.idClient){
        if(!condition){
          this.saveCllient();
          this.showSaveClientModal();
          this.submitted = false;
          this.form.reset();
        }else{
          this.showCpfExists();
        }
      }else{
        this.updateClient(this.form.value);
        this.showUpdateClientModal();
        this.router.navigate(['/client']);
      }
    }else{
      this.showFormIsntValid();
    }
  }

  onCancel(): void{
    this.submitted = false;
    this.form.reset();
  }

    /****************************** CEP ************************************/

    popularForm(data: any, index: any): void{
      const controlArray = <FormArray> this.form.get('adresses');
      controlArray.controls[index].get('street')?.setValue(data.logradouro);
      controlArray.controls[index].get('neighborhood')?.setValue(data.bairro);
      controlArray.controls[index].get('city')?.setValue(data.localidade);
      controlArray.controls[index].get('state')?.setValue(data.uf);
    }

    verifyCep(index: number){
      let cep = this.getAdressFormGroup().controls[index].get('cep')?.value
      if(cep != null && cep !== ''){
        this.consultaCep.consultaCep(cep)
          .pipe(
            take(1)
          )
          .subscribe(
            (data: any) => {this.popularForm(data, index)},
            (erro: Error) => console.log(erro)
          )
      }
    }

    verifyIfisUpdateOrLogin(): boolean{
      if(this.form.value.idClient){
        return true;
      }
      return false;
    }

    /****************************** SHOW MODAL ************************************/

    showSaveClientModal(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'success';
      this.bsModalRef.content.message = 'The client was successfully saved!';
    }

    showUpdateClientModal(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'success';
      this.bsModalRef.content.message = 'The client has been successfully updated!';
    }

    showFormIsntValid(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'warning';
      this.bsModalRef.content.message = "Form isn't valid!";
    }

    showCpfExists(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'warning';
      this.bsModalRef.content.message = "This cpf already exists! Please register another one.";
    }

    showCpfIsntValid(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'warning';
      this.bsModalRef.content.message = "Cpf is not valid! Please choose another one.";
    }

    showAdressDeleted(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'danger';
      this.bsModalRef.content.message = "Adress has been successfully deleted!";
    }

    showTelephoneDeleted(){
      this.bsModalRef = this.modalService.show(AlertModalComponent);
      this.bsModalRef.content.type = 'danger';
      this.bsModalRef.content.message = "Telephone has been successfully deleted!";
    }
    

}
