import { AbstractControl, ValidatorFn } from '@angular/forms';

// Regular expression to validate email format
const EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

// Custom email validator function
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = EMAIL_REGEXP.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;
    if (value && value.length >= 8) {
      return null; // Valid password, return null for no validation errors
    } else {
      return { minlength: true }; // Invalid password, return an error object with 'minlength' key
    }
  };
}

