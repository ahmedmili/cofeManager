import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http"
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.apiUrl

  constructor(private httpClient: HttpClient) { }

  signup(data: any) {
    // console.table(data)
    return this.httpClient.post(this.url + "/user/signup", data, {
      headers: new HttpHeaders().set('content-type', "application/json")
    })
  }
  signin(data: any) {
    // console.table(data)
    return this.httpClient.post(this.url + "/user/login", data, {
      headers: new HttpHeaders().set('content-type', "application/json")
    })
  }

  forgetPassword(data: any) {
    // console.table(data)
    return this.httpClient.post(this.url + "/user/forgetPassword", data, {
      headers: new HttpHeaders().set('content-type', "application/json")
    })
  }
  
  checkToken() {
    return this.httpClient.get(this.url + "/user/checkToken", {
    })
  }





}
