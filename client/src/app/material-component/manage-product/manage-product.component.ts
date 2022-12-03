import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constants';

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

  }

  handleEditAction(value:any){

  }
  
  handleDeleteAction(value:any){

  }

  onChange(status:any,id:any){
    
  }

}
