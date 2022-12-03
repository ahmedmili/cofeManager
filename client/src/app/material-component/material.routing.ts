import { Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterGuardService } from '../services/router-guard.service';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageProductComponent } from './manage-product/manage-product.component';



export const MaterialRoutes: Routes = [
    {
        path:"category",
        component:ManageCategoryComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin']
        }
    },
    {
        path:"product",
        component:ManageProductComponent,
        canActivate:[RouterGuardService],
        data:{
            expectedRole:['admin']
        }
    }
];
