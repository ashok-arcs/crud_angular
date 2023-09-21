import { Component, OnInit, ViewChild, Optional } from '@angular/core';
import { AdminPostService } from 'src/app/admin-post.service';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgToastService } from 'ng-angular-popup';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.component.html',
  styleUrls: ['./add-order.component.css']
})


export class AddOrderComponent implements OnInit {

  addOrderForm: FormGroup;

  customerError :string = "";
  productError :string = "";
  descriptionError :string = "";
  priceError:string = "";


  isReadOnly: boolean = true;
  isHide: boolean = false;

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router,
    private http: HttpClient
    ){
    /**
     * Add customer form validator start
     */
      this.addOrderForm = this.formBuilder.group({
        selectedCustomer: ['', Validators.required],
        selectedProduct:['', Validators.required],
        price: ['', Validators.required],
        description:['', Validators.required]
      });
      /**
       * Add customer form validator end
       */
    };

  ngOnInit(): void {
    this.getCustomersList();
    this.getProductsList();
  }

/**
 * on-select-change show price and description
 * @param event 
 */
  onSelectChange(event: Event) {
    let selectedValue = parseInt((event.target as HTMLSelectElement).value);
    if(selectedValue > 0)
    {
      this.isHide = true;
      const index = this.findIndexUsingPostId(selectedValue, this.products);
      if(index !== -1)
      {
        this.addOrderForm.patchValue({
          price: this.products[index].price,
          description: this.products[index].description,
        });
      }
    }
    else
    {
      this.isHide = false;
    }
  }
  /**
   * Get customers list
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
   * Get products list
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
 * Add a new order
 */
  addOrder()
  {
    if (this.addOrderForm.valid) 
    {
      const formData = new FormData();
      formData.append("customer_id", this.addOrderForm.value.selectedCustomer);
      formData.append("product_id", this.addOrderForm.value.selectedProduct);
      formData.append("product_price", this.addOrderForm.value.price);
      formData.append("product_description", this.addOrderForm.value.description);

       this.adminPost.addOrder(formData).subscribe(
         (data) => {
          this.customerError = this.productError = this.descriptionError = this.priceError = '';
          this.router.navigate(['orders']);
           this.toast.success({detail:'Product added successfully.'});
         },
         error => {
           let errorRes : any = error.error
           this.customerError = errorRes.name;
           this.productError = errorRes.name;
           this.descriptionError = errorRes.name;
           this.priceError = errorRes.name;
         },
       );
    }
    else 
    {
      this.markAllFormControlsAsTouched(this.addOrderForm);
    }
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
   * find index using order_id
   * @param itemId 
   * @returns order index number
   */
   findIndexUsingPostId(itemId: number, listVariable :any) 
   {
     const index = listVariable.findIndex((item: { id: number; }) => item.id === itemId);
     return index;
   }
}
