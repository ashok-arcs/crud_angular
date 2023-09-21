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

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent {

  addProductForm: FormGroup;

  constructor(
    private adminPost:AdminPostService, 
    private toast: NgToastService, 
    private formBuilder: FormBuilder,
    private router:Router,
    private http: HttpClient
    ){
      this.addProductForm = this.formBuilder.group({
        name: ['', Validators.required],
        price: ['', Validators.required],
        description: ['', Validators.required],
        image: ['']
      });
    };


  nameError : string = "";
  priceError : string = "";
  descriptionError : string = "";

  //files: string[] = [];


  files: File[] = [];

	onSelect(event: { addedFiles: any; }) {
		console.log("===============",event);
		this.files.push(...event.addedFiles);
	}


	onRemove(event: File) {
		this.files.splice(this.files.indexOf(event), 1);
	}

   /**
   * Add Product
   */
   addProduct()
   { 

     if (this.addProductForm.valid) {
      const formData = new FormData();
      formData.append("name", this.addProductForm.value.name);
      formData.append("price", this.addProductForm.value.price);
      formData.append("description", this.addProductForm.value.description);

      const inputElement = document.getElementById('fileID') as HTMLInputElement;
      const files: FileList | null = inputElement.files;
      if (files && files.length > 0) {
        const file = files[0];
        formData.append('file', file, file.name); // Append each file to the FormData
      }

       this.adminPost.addProduct(formData).subscribe(
         (data) => {
          this.nameError = this.priceError = this.descriptionError = '';
           this.router.navigate(['products']);
           this.toast.success({detail:'Product added successfully.'});
         },
         error => {
           let errorRes : any = error.error

           this.nameError = errorRes.name;
           this.priceError = errorRes.price;
           this.descriptionError = errorRes.description;
         },
       );
     } else {
       this.markAllFormControlsAsTouched(this.addProductForm);
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
}
