import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BillService {
  url = environment.apiUrl;

  constructor(private httpClient:HttpClient) { }

  generateReport(data:any){
    return this.httpClient.post(this.utl+"bill/generateReport/",data,{
      headers:new HttpHeaders().set("Content-Type","application/json")
    })
  }

  getPDF(data:any):Observable<Blob>{
    return this.httpClient.post(this.url+"/bill/getPdf",data,{responseType:'blob'});
  }



}
