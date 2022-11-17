import { Injectable } from '@angular/core';
import { MatSnackBar } from "@angular/material/snack-bar"


@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackbar: MatSnackBar) { }

  openSnackBar(msg: string, action: string) {
    if (action === 'error') {
      this.snackbar.open(msg, "", {
        horizontalPosition: 'center',
        verticalPosition: "top",
        duration: 2000,
        panelClass: ['black-snackbar']
      })
    } else {
      this.snackbar.open(msg, "", {
        horizontalPosition: 'center',
        verticalPosition: "top",
        duration: 2000,
        panelClass: ['green-snackbar']
      })
    }
  }

}
