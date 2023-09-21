import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from './environment';

@Injectable({
  providedIn: 'root'
})
export class UserLoginService {

  baseUrl: string = API_BASE_URL;
  constructor(
      private httpClient:HttpClient
  ) { }

  loginUser(data:any)
  {
   return this.httpClient.post(this.baseUrl + "/login", data);
  }

  validateToken(data:any)
  {
   return this.httpClient.post(this.baseUrl + "/isValidToken", data);
  }

  forgotUserPassword(data:any)
  {
    return this.httpClient.post(this.baseUrl + "/forgot-password", data);
  }

  resetUserPassword(data:any)
  {
    delete data.conf_password;
    console.log(data)
    return this.httpClient.post(this.baseUrl + "/reset-password", data);
  }

}
