import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HomeServiceService } from '../home-service.service';
import { NgToastService } from 'ng-angular-popup';
import { emailValidator } from '../validators/email_password.validator';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  
  registerForm: FormGroup;
  constructor(
        private homeService: HomeServiceService,
        private toast: NgToastService,
        private formBuilder: FormBuilder,
        private router: Router
    ) 
  {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, emailValidator()]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  nameError : string = "";
  emailError : string = "";
  passwordError : string = "";
  tokenValue : string = "";
  
  registerUser() 
  {
    if (this.registerForm.valid) 
    {
      this.homeService.addNewUser(this.registerForm.value).subscribe(
        (data) => {
          this.nameError = this.emailError = this.passwordError = '';
          this.registerForm.reset();
          this.toast.success({detail:'You are signup successfully. Please login'})
           // After successful signup, navigate to the login page
          this.router.navigate(['login']);
        },
        error => {
          let errorRes : any = error.error
          this.nameError = errorRes.name;
          this.emailError = errorRes.email;
          this.passwordError = errorRes.password;
        },
      );
    }
    else
    {
      this.markAllFormControlsAsTouched(this.registerForm);
    }
  }

 /**
   * Mark all form fields touched 
   * @param formName 
   */
 markAllFormControlsAsTouched(formName:any) 
 {
  Object.keys(formName.controls).forEach(field => {
    const control = formName.get(field);
    if (control) {
      control.markAsTouched({ onlySelf: true });
    }
  });
}
  
}