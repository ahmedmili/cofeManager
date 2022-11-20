import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm:any = FormGroup;
  responseMessage:any;



  
  constructor(private formBuilder:FormBuilder,
                private router:Router,
                private userService:UserService,
                private SnackbarService:SnackbarService,
                private dialogRef:MatDialogRef<SignupComponent>,
                ) { }

  ngOnInit(): void {

    this.signupForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactRegex)]],
      password:[null,[Validators.required]],
    })
  }
  
  handleSubmit(){
    var formDate = this.signupForm.value;
    var data ={
      name: formDate.name,
      email:formDate.email,
      contactNumber:formDate.contactNumber,
      password:formDate.password
    }
    this.userService.signup(data).subscribe((response:any)=>{
      this.dialogRef.close();
      this.responseMessage = response?.message;
      this.SnackbarService.openSnackBar(this.responseMessage,"")
      this.router.navigate(['/']);
    },(error)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg
      }else{
        this.responseMessage =GlobalConstants.genericError;
      }
      this.SnackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }

  
}
