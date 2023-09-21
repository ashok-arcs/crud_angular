import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent  implements OnInit{

  resetPassForm: FormGroup;
  passwordError : string = "";
  resetToken : number = 0;

  constructor(
        private toast: NgToastService,
        private userLogin: UserLoginService,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    )
  {

    this.resetPassForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      conf_password: ['',]},{ validator: this.passwordMatchValidator });
  }
  ngOnInit(): void {
     // Access the parameter from the URL
     this.route.params.subscribe(params => {
      this.resetToken = params['resetcode']; // '1234' in your example URL
    });
  }

  // Custom validator function to check if passwords match
  passwordMatchValidator(formGroup: FormGroup) 
  {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('conf_password');
    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) 
      {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else 
      {
        confirmPasswordControl.setErrors(null);
      }
    }
  }

showError : any;
  resetPass() 
  {
    if (this.resetPassForm.valid) 
    {
      this.resetPassForm.value.reset_token = this.resetToken;
      this.userLogin.resetUserPassword(this.resetPassForm.value).subscribe(
        (data:any) => {
          this.passwordError = '';
          this.resetPassForm.reset();
          this.toast.success({detail:data.response})
           // After successful reset, navigate to the login page
          this.router.navigate(['login']);
        },
        error => {
          this.toast.error({detail:error.error.response})
        });
    }
    else
    {
      this.markAllFormControlsAsTouched(this.resetPassForm);
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
