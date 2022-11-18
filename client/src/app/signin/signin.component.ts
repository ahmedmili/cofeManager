import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {

  signinForm:any = FormGroup;
  responseMessage:any;



  
  constructor(private formBuilder:FormBuilder,
                private router:Router,
                private userService:UserService,
                private SnackbarService:SnackbarService,
                private dialogRef:MatDialogRef<SigninComponent>,
                // private ngxService: NgxUiLoaderService
                ) { }

  ngOnInit(): void {

    this.signinForm = this.formBuilder.group({
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      password:[null,[Validators.required]],
    })
  }
  
  handleSubmit(){
    // this.ngxService.start()
    var formDate = this.signinForm.value;
    var data ={
      email:formDate.email,
      password:formDate.password
    }
    this.userService.signin(data).subscribe((response:any)=>{
      // this.ngxService.stop()
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.SnackbarService.openSnackBar(this.responseMessage,"")
      this.router.navigate(['/']);
    },(error)=>{
      // this.ngxService.stop()
      if(error.error?.message ){
        this.responseMessage = error.error?.message
      }else{
        this.responseMessage =GlobalConstants.genericError;
      }
      this.SnackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }
}
