import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-userlogin',
  templateUrl: './userlogin.component.html',
  styleUrls: ['./userlogin.component.css']
})


export class UserloginComponent {
  loginForm: FormGroup;
  constructor(
        private toast: NgToastService,
        private userLogin: UserLoginService,
        private formBuilder: FormBuilder,
        private router: Router
    ) 
  {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  emailError : string = "";
  passwordError : string = "";

  loginUser() 
  {
    if (this.loginForm.valid) 
    {
      this.userLogin.loginUser(this.loginForm.value).subscribe(
        (data:any) => {
          localStorage.setItem('token', data.token);
          this.emailError = this.passwordError = '';
          this.loginForm.reset();
          this.toast.success({detail:'Login successfully.'})
           // After successful signup, navigate to the login page
          this.router.navigate(['post-listing']);
      
        },
        error => {
          this.emailError = error.error.email;
          this.passwordError = error.error.password;
        }, ()=>{});
    }
    else
    {
      this.markAllFormControlsAsTouched(this.loginForm);
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
