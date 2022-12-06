import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(): Observable<boolean> {
    this.authService.isAuth().pipe(
      tap((state: any) => {
        if (!state) {
          this.router.navigate(['/login']);
        }
      }),
      take(1)
    );
    return of(true);
  }
}
