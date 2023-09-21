import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserloginComponent } from './userlogin/userlogin.component';
import { authGuard } from './auth.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CustomersComponent } from './customers/customers.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';

const routes: Routes = [ 
  { path: '', component: HomeComponent },
  { path: 'post-listing', component: AdminComponent, canActivate:[authGuard] },
  { path: 'login', component: UserloginComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'password/reset/:resetcode', component: ResetPasswordComponent },
  { path: 'customers', component: CustomersComponent, canActivate:[authGuard] },
  { path: 'add-customer', component: AddCustomerComponent, canActivate:[authGuard] },
  { path: 'products', component: ProductsComponent, canActivate:[authGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate:[authGuard] },
  { path: 'orders', component: OrdersComponent, canActivate:[authGuard] },
  { path: 'add-order', component: AddOrderComponent, canActivate:[authGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
