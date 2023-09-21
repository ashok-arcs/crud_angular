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
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  private recordAddedSubscription: Subscription = new Subscription;
  recordAdded = new Subject<void>();

  customerError :string = "";
  productError :string = "";
  descriptionError :string = "";
  priceError:string = "";

  // Pagination variables
  currentPage = 1;
  itemsPerPage = 5; // Number of items to display per page
  isReadOnly: boolean = true;
  isHide: boolean = false;

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router,
    private http: HttpClient
    ){
    };

  ngOnInit(): void {
    this.getOrdersList();
  }

/**
 * Get orders list
 */
   orders : any;
   getOrdersList()
   {
     this.adminPost.getOrders().subscribe(
       (data) => {
         this.orders = data;
       },
       error => {
         let errorRes : any = error.error
         this.toast.error({detail:errorRes.error})
       }
     );
   }



   /**
 * Delete Order using order id
 * @param id
 */
   deleteOrder(id:number)
   {
     const result = window.confirm('Are you sure you want to delete this item?');
     if(id>0 && result)
     {
       this.adminPost.deleteOrder(id).subscribe(
         (data) => {
           const index = this.findIndexUsingPostId(id, this.orders);
           if (index !== -1) 
           {
             this.orders.splice(index, 1);
           }
           this.toast.success({detail:"Order successfully delete."});
         },
         error => {
           let errorRes : any = error.error
           this.toast.error({detail:"Error"})
         },
       );
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
