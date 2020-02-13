import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'  // <- ADD THIS
})
export class AuthService {
  region: string;
  regionid:string;
  regioncode:string;

  constructor() {

  }
}