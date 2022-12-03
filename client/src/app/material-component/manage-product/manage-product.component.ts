import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ProductComponent } from '../dialog/product/product.component';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.scss']
})
export class ManageProductComponent implements OnInit {
  displayedColumn:string[]=['name','categoryName','description','price','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router,
    private productService:ProductsService
  ) { }

  ngOnInit(): void {
    this.tableData();
  }

  tableData(){
      this.productService.getProducts().subscribe((response:any)=>{
          this.dataSource = new MatTableDataSource(response);
          },(error:any)=>{
              console.log(error);
              if(error.error?.msg){
                  this.responseMessage= error.error?.msg;
              }else{
                this.responseMessage = GlobalConstants.genericError;
              }
       this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }


  applyFilter(event:Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleAddAction(){
   const dialogConfig = new MatDialogConfig();
   dialogConfig.data = {
    action : 'Add'
   }
   dialogConfig.width = "850px";
   const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
   this.router.events.subscribe(()=>{
    dialogRef.close();
   })
   const sub = dialogRef.componentInstance.onAddProduct.subscribe((response)=>{
    this.tableData()
   })
  }

  handleEditAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
     action : 'Edit',
     data: values
    }
    dialogConfig.width = "850px";
    const dialogRef = this.dialog.open(ProductComponent,dialogConfig);
    this.router.events.subscribe(()=>{
     dialogRef.close();
    })
    const sub = dialogRef.componentInstance.onEditProduct.subscribe((response)=>{
     this.tableData()
    })
  }
  
  handleDeleteAction(values:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message:'delete' + values.name+ "product"
    };
    const dialogRef = this.dialog.open(ConfirmationComponent,dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStateChange.subscribe((response)=>{
      this.deleteProduct(values.id)
      dialogRef.close()
    })
  }


  deleteProduct(id:any){
    this.productService.delete(id).subscribe((response:any)=>{
      this.tableData();
      this.responseMessage = response?.msg;
      this.snackbarService.openSnackBar(this.responseMessage,"success")
    },(error:any)=>{
        console.log(error);
        if(error.error?.msg){
            this.responseMessage= error.error?.msg;
        }else{
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })

  }

  onChange(status:any,id:any){
    var data = {
      status:status.toString(),
      id:id
    }
    this.productService.updateStatus(data).subscribe((response:any)=>{
      this.responseMessage = response?.msg;
      this.snackbarService.openSnackBar(this.responseMessage,"success")
    },(error:any)=>{
      console.log(error);
      if(error.error?.msg){
          this.responseMessage= error.error?.msg;
      }else{
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }

}
