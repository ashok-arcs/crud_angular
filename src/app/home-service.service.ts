import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from './environment';

@Injectable({
  providedIn: 'root'
})
export class HomeServiceService {

  baseUrl: string = API_BASE_URL;

  constructor(private httpClient:HttpClient) { }
  
  addNewUser(data:any){
   return this.httpClient.post(this.baseUrl + "/newuser", data);
  }

}
