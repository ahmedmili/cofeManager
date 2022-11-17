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
    console.table(data)
    return this.httpClient.post(this.url + "/user/signup", data, {
      headers: new HttpHeaders().set('content-type', "application/json")
    })
  }



}
