import { Component, OnInit, ViewChild, Optional } from '@angular/core';
import { AdminPostService } from '../admin-post.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../environment';
import { HeaderComponent } from '../header/header.component';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  updateCustomerForm: FormGroup;
  searchQuery: string = '';
  filteredCamps: any;
  baseUrl = API_BASE_URL;

  @ViewChild('updatecustomerbutton') updatecustomerbutton: any;

  private recordAddedSubscription: Subscription = new Subscription;
  recordAdded = new Subject<void>();

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router,
    private http: HttpClient
    ){
      /**
       * Update customer form validator end
       */
        this.updateCustomerForm = this.formBuilder.group({
          id: [''],
          name: ['', Validators.required],
          email: ['', Validators.required],
          phone: ['', Validators.required],
          address: ['', Validators.required],
          image: [''],
        });
      /**
       * Update customer form validator end
       */
    };

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 5; // Number of items to display per page

  nameError : string = "";
  emailError : string = "";
  phoneError : string = "";
  addressError : string = "";

  ngOnInit(): void {
    this.getCustomersList();

     // Subscribe to the event when a new record is added
     this.recordAddedSubscription = this.recordAdded.subscribe(() => {
      this.getCustomersList();
    });

  }
   /**
   * Get customers data
   */
   customers : any;
   getCustomersList()
   {
     this.adminPost.getCustomers().subscribe(
       (data) => {
         this.customers = data;
       },
       error => {
         let errorRes : any = error.error
         this.toast.error({detail:errorRes.error})
       }
     );
   }

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
 * Show selected post data
 * @param itemId 
 *
 */
  test : any;
  test1 : any;
   editCustomer(itemId:number) 
  {
    const index = this.findIndexUsingPostId(itemId);
    if (index !== -1) 
    {
      this.test = this.customers[index].profile_image;
      this.test1 = this.customers[index].path;

      // Patch the form values
      this.updateCustomerForm.patchValue({
        id: this.customers[index].id,
        name: this.customers[index].name,
        email: this.customers[index].email,
        phone: this.customers[index].phone,
        address: this.customers[index].address,
      });
    }
  }

  /**
 * Delete Customer using customer id
 * @param id
 */
  deleteCustomer(id:number)
  {
    const result = window.confirm('Are you sure you want to delete this item?');
    if(id>0 && result)
    {
      this.adminPost.deleteCustomer(id).subscribe(
        (data) => {
          const index = this.findIndexUsingPostId(id);
          if (index !== -1) 
          {
            this.customers.splice(index, 1);
          }
          this.toast.success({detail:"Customer successfully delete."});
        },
        error => {
          let errorRes : any = error.error
          this.toast.error({detail:"Error"})
        },
      );
    }
  }

  updateCustomer()
  {
    if (this.updateCustomerForm.valid) 
    {
      const formData = new FormData();
      formData.append("name", this.updateCustomerForm.value.name);
      formData.append("email", this.updateCustomerForm.value.email);
      formData.append("phone", this.updateCustomerForm.value.phone);
      formData.append("address", this.updateCustomerForm.value.address);

      const inputElement = document.getElementById('updatefileID') as HTMLInputElement;
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file = files[0];
        formData.append('profile_image', file, file.name); // Append each file to the FormData
      }

      this.adminPost.updateCustomer(formData, this.updateCustomerForm.value.id).subscribe(
        (data) => {
          this.nameError = this.addressError = '';
          this.updateCustomerForm.reset();
          this.toast.success({detail:'Customer Updated successfully.'});
          // Emit event to notify the component
          this.recordAdded.next();
          this.updatecustomerbutton.nativeElement.click();
        },
        error => {
          let errorRes : any = error.error
          this.nameError = errorRes.title;
          this.addressError = errorRes.content;
        },
      );
    }
    else
    {
      this.markAllFormControlsAsTouched(this.updateCustomerForm);
    }
  }


   /**
   * find index using customer_id
   * @param itemId 
   * @returns post index number
   */
   findIndexUsingPostId(itemId: number) 
   {
     const index = this.customers.findIndex((item: { id: number; }) => item.id === itemId);
     return index;
   }

}
