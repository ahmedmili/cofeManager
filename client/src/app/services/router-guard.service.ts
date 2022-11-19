import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router ,ActivatedRouteSnapshot} from '@angular/router';
import { SnackbarService } from './snackbar.service';
import jwt_decode from "jwt-decode"
import { GlobalConstants } from '../shared/global-constants';
@Injectable({
  providedIn: 'root'
})
export class RouterGuardService {

  constructor(
    public auth:AuthService,
    public router:Router,
    private snackbarService: SnackbarService
  ) { }

  canActivate(route:ActivatedRouteSnapshot):boolean{
      let expectedRoleArray = route.data;
      expectedRoleArray = expectedRoleArray.expetedRole;

      const token:any =localStorage.getItem("token")
      var tokenPlayLoad : any;
      try{
        tokenPlayLoad = jwt_decode(token)
      }catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let checkRole = false;

      for(let i=0;i<expectedRoleArray.length;i++){
        if(expectedRoleArray[i] == tokenPlayLoad.role){
          checkRole = true
        }
      }
      if(tokenPlayLoad.role == 'user' || tokenPlayLoad.role == 'admin'){
          if(this.auth.isAuthenticated() && checkRole){
            return true;
          }
          this.snackbarService.openSnackBar(GlobalConstants.unauthorized,GlobalConstants.genericError)
          this.router.navigate(['/cofe/dashboard'])
          return false;
      }else{
        this.router.navigate(['/'])
        localStorage.clear
        return false
      }
  }


}
