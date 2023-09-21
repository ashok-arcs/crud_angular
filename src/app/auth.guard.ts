import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { retry } from 'rxjs';
import { UserLoginService } from './user-login.service';
export const authGuard: CanActivateFn = async (route, state) => {

  let _router = inject(Router);
  const token = localStorage.getItem("token");
  const authService = inject(UserLoginService);



  function canActivate(){
    if (authService.validateToken(token)) {
      alert('true');
        return true;
    } else {
      alert('false');

        return false;
    }
  };

  if (token == null || token == "") {
    _router.navigate(["login"]);
    return false;
  }
return true;

};
function canActivate() {
  throw new Error('Function not implemented.');
}

