import { HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  const router = inject(Router)
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

return next(req).pipe(
  tap({
    error: (err) => {

      console.error('Response error:', err.status);
      
      if (err.status === 403) {
        localStorage.removeItem('auth_token');
        router.navigate(["/login"]);
      }
    }
  }))
};