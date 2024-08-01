import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, switchMap, filter, take } from 'rxjs/operators';
import { AccountService } from '../service/account.service';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    constructor(private accountService: AccountService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // const userToken=localStorage.getItem('userToken');
        const accessToken = localStorage.getItem('accessToken');
        const doctorToken = localStorage.getItem('docToken');
        const adminToken = localStorage.getItem('adminToken');

        let authReq = req;

        if (accessToken || doctorToken || adminToken) {
            if (accessToken) {
                authReq = authReq.clone({
                    headers: authReq.headers.set('Authorization-User', `Bearer ${accessToken}`)
                });
            }

            if (doctorToken) {
                authReq = authReq.clone({
                    headers: authReq.headers.set('Authorization-Doctor', `Bearer ${doctorToken}`)
                });
            }

            if (adminToken) {
                authReq = authReq.clone({
                    headers: authReq.headers.set('Authorization-Admin', `Bearer ${adminToken}`)
                });
            }
        }

        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Handle 401 errors
                    return this.handle401Error(authReq, next);
                } else {
                    return throwError(() => error);
                }
            })
        );
    }

    private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            const refreshToken = localStorage.getItem('refreshToken'); // Updated to use correct key
            if (refreshToken) {
                return this.accountService.refreshToken(refreshToken).pipe(
                    switchMap((token: any) => {
                        localStorage.setItem('accessToken', token.accessToken); // Store new access token
                        this.isRefreshing = false;
                        this.refreshTokenSubject.next(token.accessToken);
                        console.log("The refreshed token is", token.accessToken);

                        return next.handle(this.addTokenHeader(request, token.accessToken));
                    }),
                    catchError((err) => {
                        this.isRefreshing = false;
                        // Handle refresh token failure (e.g., logout user)
                        return throwError(() => new Error(err.message));
                    })
                );
            } else {
                // No refresh token available
                this.isRefreshing = false;
                return throwError(() => new Error('No refresh token available'));
            }
        } else {
            return this.refreshTokenSubject.pipe(
                filter(token => token !== null),
                take(1),
                switchMap(token => {
                    return next.handle(this.addTokenHeader(request, token));
                })
            );
        }
    };

    private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
            headers: request.headers.set('Authorization-User', `Bearer ${token}`)
        });
    };
}
