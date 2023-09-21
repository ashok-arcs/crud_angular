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
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  updateCustomerForm: FormGroup;
  searchQuery: string = '';
  filteredCamps: any;
  baseUrl = API_BASE_URL;

  @ViewChild('addpostbutton') addpostbutton: any;
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
          price: ['', Validators.required],
          description: ['', Validators.required],
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
  priceError : string = "";
  descriptionError : string = "";

  ngOnInit(): void {
    this.getProductsList();
    // Subscribe to the event when a new record is added
    this.recordAddedSubscription = this.recordAdded.subscribe(() => {
      this.getProductsList();
    });
  }
   /**
   * Get products data
   */
   products : any;
   getProductsList()
   {
     this.adminPost.getProducts().subscribe(
       (data) => {
         this.products = data;
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
      this.test = this.products[index].image;
      this.test1 = this.products[index].path;

      // Patch the form values
      this.updateCustomerForm.patchValue({
        id: this.products[index].id,
        name: this.products[index].name,
        price: this.products[index].price,
        description: this.products[index].description,
      });
    }
  }

  /**
 * Delete Customer using customer id
 * @param id
 */
  deleteProduct(id:number)
  {
    const result = window.confirm('Are you sure you want to delete this item?');
    if(id>0 && result)
    {
      this.adminPost.deleteProduct(id).subscribe(
        (data) => {
          const index = this.findIndexUsingPostId(id);
          if (index !== -1) 
          {
            this.products.splice(index, 1);
          }
          this.toast.success({detail:"Product successfully delete."});
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
      formData.append("price", this.updateCustomerForm.value.price);
      formData.append("description", this.updateCustomerForm.value.description);

      const inputElement = document.getElementById('updatefileID') as HTMLInputElement;
      const files: FileList | null = inputElement.files;

      if (files && files.length > 0) {
        const file = files[0];
        formData.append('image', file, file.name); // Append each file to the FormData
      }

      this.adminPost.updateProduct(formData, this.updateCustomerForm.value.id).subscribe(
        (data) => {
          this.nameError = this.descriptionError = '';
          this.updateCustomerForm.reset();
          this.toast.success({detail:'Product Updated successfully.'});
          // Emit event to notify the component
          this.recordAdded.next();
          this.updatecustomerbutton.nativeElement.click();
        },
        error => {
          let errorRes : any = error.error
          this.nameError = errorRes.title;
          this.descriptionError = errorRes.content;
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
     const index = this.products.findIndex((item: { id: number; }) => item.id === itemId);
     return index;
   }
}
