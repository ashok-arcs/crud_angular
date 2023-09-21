import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { registerLocaleData } from '@angular/common';
import localeEnIN from '@angular/common/locales/en-IN';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgToastModule } from 'ng-angular-popup';
import { AdminComponent } from './admin/admin.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserloginComponent } from './userlogin/userlogin.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CustomersComponent } from './customers/customers.component';
import { HeaderComponent } from './header/header.component';
import { ProductsComponent } from './products/products.component';
import { OrdersComponent } from './orders/orders.component';
import { TruncatePipe } from './truncate.pipe';
import { AddCustomerComponent } from './customers/add-customer/add-customer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AddProductComponent } from './products/add-product/add-product.component';
import { AddOrderComponent } from './orders/add-order/add-order.component';
import { NgxDropzoneChangeEvent, NgxDropzoneModule } from 'ngx-dropzone';

registerLocaleData(localeEnIN); 
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserloginComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    CustomersComponent,
    HeaderComponent,
    ProductsComponent,
    OrdersComponent,
    TruncatePipe,
    AddCustomerComponent,
    SidebarComponent,
    AddProductComponent,
    AddOrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgToastModule,
    NgxPaginationModule,
    NgxDropzoneModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
