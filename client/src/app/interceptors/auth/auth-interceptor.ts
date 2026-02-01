import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth-service/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService)

  if (authService.isLoggedIn()){
    const token = authService.getToken()
    console.log("authorated request")
    req = req.clone({
      headers: req.headers.append("Authorization", `Token ${token}`)
    })
  }
  
  return next(req);
};
