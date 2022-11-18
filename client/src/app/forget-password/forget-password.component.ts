import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
// import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SnackbarService } from '../services/snackbar.service';
import { UserService } from '../services/user.service';
import { GlobalConstants } from '../shared/global-constants';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgetPasswordForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private formBuilder:FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ForgetPasswordComponent>,
    // private ngxService : NgxUiLoaderService,
    private sneackbarService: SnackbarService

  ) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],

    })
  }

  handleSubmit() {
    // this.ngxService.start()
    var formData = this.forgetPasswordForm.value;
    var data = {
      email: formData.email
    }
    this.userService.forgetPassword(data).subscribe((response: any) => {
      // this.ngxService.stop()
      this.responseMessage = response.msg;
      console.log(this.responseMessage)
      this.dialogRef.close();
      this.sneackbarService.openSnackBar(this.responseMessage, "");
    }, (err) => {
      // this.ngxService.stop()
      if (err.error?.message) {
        this.responseMessage = err.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.sneackbarService.openSnackBar(this.responseMessage, GlobalConstants.err)
    }

    )
  }



}
