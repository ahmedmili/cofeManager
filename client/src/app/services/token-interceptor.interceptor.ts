import { Injectable } from '@angular/core';
import {Router} from '@angular/router'
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { 
  Observable,
  throwError
 } from 'rxjs';
 import { 
  catchError
 } from 'rxjs/operators'

@Injectable()

export class TokenInterceptorInterceptor implements HttpInterceptor {

  constructor(
    private router : Router
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
   
    const token = localStorage.getItem('token');
    // console.log(token)
    if(token){
      request= request.clone({
        setHeaders:{Authorization:`Bearer ${token}`}
      })
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse ){
          console.log(err.url)
          // console.log("err")
          if(err.status === 401 || err.status === 403){
              if(this.router.url === '/'){
                
              }else{
                localStorage.clear();
                this.router.navigate(['/'])
              }
          }
        }
        return throwError (err)
      })
    )
  }
}
