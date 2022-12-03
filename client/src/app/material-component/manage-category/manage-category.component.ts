import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'
import {CategoryService} from 'src/app/services/category.service'
import {SnackbarService} from 'src/app/services/snackbar.service'
import { MatTableDataSource } from '@angular/material/table';
import { GlobalConstants } from 'src/app/shared/global-constants';
import { CategoryComponent } from '../dialog/category/category.component';
@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  displayedColumn:string[] = ['name','edit'];
  dataSource:any;
  responseMessage:any;

  constructor(
    private categoryService:CategoryService,
    private dialog:MatDialog,
    private snackbarService:SnackbarService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.tableData()
  }

  tableData(){
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.dataSource =new MatTableDataSource(response) ;
      // console.log(this.dataSource)
      

    },(error:any)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg;
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
  dialogConfig.data={
    action:'Add'
  }
  dialogConfig.width = "850px";
  const dialogRef = this.dialog.open(CategoryComponent,dialogConfig);
  this.router.events.subscribe(()=>{
    dialogRef.close()
  });

  const sub = dialogRef.componentInstance.onAddCategory.subscribe((response)=>{
    this.tableData()
  })
}

handleEditAction(value:any){}


}
