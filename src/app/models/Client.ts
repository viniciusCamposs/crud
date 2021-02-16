import { Adress } from "./Adress";
import { Telephone } from "./Telephone";

export class Client{
    idClient!: number;
    name!: string;
    cpf!: string;
    dt_inc!: string;
    adresses!: Adress[]; 
    telephones!: Telephone[];



}



