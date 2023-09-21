import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginService } from '../user-login.service';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {

  forgotForm: FormGroup;
  constructor(
        private toast: NgToastService,
        private userLogin: UserLoginService,
        private formBuilder: FormBuilder,
        private router: Router
    ) 
  {
    this.forgotForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  emailError : string = "";

  forgotPassword()
  {
    if (this.forgotForm.valid) 
    {
      this.userLogin.forgotUserPassword(this.forgotForm.value).subscribe(
        (data:any) => {
          this.emailError = "";
          this.forgotForm.reset();
          this.toast.success({detail:'Password reset email sent.'});
        },
        error => {
          this.emailError = error.error.email;
        }, ()=>{});
    }
    else
    {
      this.markAllFormControlsAsTouched(this.forgotForm);
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
