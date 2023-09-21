import { Component, OnInit, ViewChild, Optional } from '@angular/core';
import { AdminPostService } from 'src/app/admin-post.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from 'src/app/environment';
import { HeaderComponent } from 'src/app/header/header.component';
import { SidebarComponent } from 'src/app/sidebar/sidebar.component';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent {
  
  addCustomerForm: FormGroup;

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router,
  )
  {
      /**
     * Add customer form validator start
     */
      this.addCustomerForm = this.formBuilder.group({
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', Validators.required],
        address: ['', Validators.required],
        image: ['']
      });
      /**
       * Add customer form validator end
       */
  }

  nameError : string = "";
  emailError : string = "";
  phoneError : string = "";
  addressError : string = "";

  /**
   * Mark all form fields touched 
   * @param formName 
   */
  markAllFormControlsAsTouched(formName:any) {
    Object.keys(formName.controls).forEach(field => {
      const control = formName.get(field);
      if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

   /**
   * Add Customer
   */
   addCustomer()
   {
     if (this.addCustomerForm.valid) {

      const formData = new FormData();
      formData.append("name", this.addCustomerForm.value.name);
      formData.append("email", this.addCustomerForm.value.email);
      formData.append("phone", this.addCustomerForm.value.phone);
      formData.append("address", this.addCustomerForm.value.address);

      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');

      const inputElement = document.getElementById('fileID') as HTMLInputElement;
      const files: FileList | null = inputElement.files;
      if (files && files.length > 0) {
        const file = files[0];
        formData.append('file', file, file.name); // Append each file to the FormData
      }
       this.adminPost.addCustomer(formData).subscribe(
         (data) => {
          this.nameError = this.emailError = this.phoneError = this.addressError = '';
           //this.addCustomerForm.reset();
           this.router.navigate(['customers']);
           this.toast.success({detail:'Customer added successfully.'});
         },
         error => {
           let errorRes : any = error.error
           this.nameError = errorRes.name;
           this.emailError = errorRes.email;
           this.phoneError = errorRes.phone;
           this.addressError = errorRes.address;
         },
       );
     } else {
       this.markAllFormControlsAsTouched(this.addCustomerForm);
     }
   }

}
