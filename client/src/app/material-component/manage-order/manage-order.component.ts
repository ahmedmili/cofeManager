import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { GlobalConstants } from 'src/app/shared/global-constants';

import {CategoryService} from 'src/app/services/category.service'
import {BillService} from 'src/app/services/bill.service'
import {ProductsService} from 'src/app/services/products.service'
import {SnackbarService} from 'src/app/services/snackbar.service'

import {saveAs} from 'file-saver'

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns:string[] = ["name","category","price","quantity","total","edit"];
  dataSource:any = [];
  manageOrderForm:any = FormGroup;
  categorys:any = []
  products:any = []
  price : any;
  totalAmount:number = 0 ;
  responseMessage:any;
  constructor(
    private formBuilder:FormBuilder,
    private billService:BillService,
    private categoryService : CategoryService,
    private productsService:ProductsService,
    private snackbarService: SnackbarService,
  
  ) { }

  ngOnInit(): void {
    this.manageOrderForm = this.formBuilder.group({
      name:[null,[Validators.required,Validators.pattern(GlobalConstants.nameRegex)]],
      email:[null,[Validators.required,Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber:[null,[Validators.required,Validators.pattern(GlobalConstants.contactRegex)]],
      paymentMethod:[null,[Validators.required]],
      product:[null,[Validators.required]],
      category:[null,[Validators.required]],
      quantity:[null,[Validators.required]],
      price:[null,[Validators.required]],
      total:[0,[Validators.required]],
    })
  }

  getCategorys(){
    this.categoryService.getCategorys().subscribe((response:any)=>{
      this.categorys = response;
    },(error:any)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg;
      }else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }


  getProductByCategory(value:any){
    this.productsService.getProductsByCategory(value.id).subscribe((response)=>{
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('')
      this.manageOrderForm.controls['quantity'].setValue('')
      this.manageOrderForm.controls['total'].setValue(0)
    },(error:any)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg
      }else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }

  getProductDetails(value:any){
    this.productsService.getById(value.id).subscribe((response)=>{
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('')
      this.manageOrderForm.controls['quantity'].setValue('1')
      this.manageOrderForm.controls['total'].setValue(this.price)
    },(error:any)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg
      }else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })
  }

  setQuantity(value:any){
    var temp = this.manageOrderForm.controls['quantity'].value;
    if(temp>0){
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);

    }else if(temp != ""){
      this.manageOrderForm.controls['quantity'].setValue("1");
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls["ptice"].value)
    }
  }


  validateProductAdd(){
    if(this.manageOrderForm.controls['total'].value === 0 || this.manageOrderForm.controls['total'].value === null || this.manageOrderForm.controls['quantity'].value <=0 )
    return true
    else
    return false
  }
  
  validateSubmit(){
    if(
      this.totalAmount === 0 
      || this.manageOrderForm.controls['name'].value === null
      || this.manageOrderForm.controls['email'].value === null 
      || this.manageOrderForm.controls['contactNumber'].value === null 
      || this.manageOrderForm.controls['paymentMethod'].value === null  
      || !(this.manageOrderForm.controls['contactNumber'].valid ) 
      || !(this.manageOrderForm.controls['email'].valid ) 
      )
    return true
    else
    return false
  }

  add(){
    var formData = this.manageOrderForm.value
    var productName = this.dataSource.find((e:{id:number})=>e.id = formData.product.id);
    if(productName === undefined){
      this.totalAmount = this.totalAmount + formData.total
      this.dataSource.push({
        id:formData.product.id,
        name: formData.product.name,
        category : formData.category.name,
        quantity : formData.quantity,
        price: formData.price,
        total: formData.total
      });
      this.dataSource = [... this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded,"Success")
    }else{
      this.snackbarService.openSnackBar(GlobalConstants.productExistError,GlobalConstants.err)
    }
  
  }

  handleDeletAction(value:any,element:any){
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value,1)
    this.dataSource= [... this.dataSource]
  }
 
  submitAction(){
    var formData = this.manageOrderForm.value
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource)
    }
    this.billService.generateReport(data).subscribe((response:any)=>{
      this.downloadFile(response?.uuid)
      this.manageOrderForm.reset()
      this.dataSource = []
      this.totalAmount = 0
    },(error:any)=>{
      if(error.error?.msg){
        this.responseMessage = error.error?.msg
      }else{
        this.responseMessage = GlobalConstants.genericError
      }
      this.snackbarService.openSnackBar(this.responseMessage,GlobalConstants.err)
    })

    
  }
  downloadFile(fileName:any){
    var data = {
      uuid : fileName
    }
    this.billService.getPDF(data).subscribe((response:any)=>{
      saveAs(response,fileName+'.pdf')
      
    })
  }

}
