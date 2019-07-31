import {Injectable, Provider} from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, Observable, OperatorFunction, throwError} from 'rxjs';
import {catchError, filter, first, switchMap} from 'rxjs/operators';
import {CurrentUserService} from './currentuser.service';


export interface Tokens {
  accessToken?: string | null;
  refreshToken?: string | null;
}

@Injectable()
export class HttpAuthInterceptor implements HttpInterceptor {
  private tokens$ = new BehaviorSubject<Tokens | undefined | null>(undefined);

  constructor(private currentUserService: CurrentUserService) {
    this.currentUserService.auth$.subscribe((auth) => {
      this.tokens$.next(auth == undefined ? {} : auth);
    });
  }

  // tslint:disable-next-line:no-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.waitTokensAndDoRequest(req, next).pipe(
      catchError(error => {
        if (!(error instanceof HttpErrorResponse && error.status === 401)) {
          return throwError(error);
        }

        const tokens = this.tokens$.value;
        if (tokens == undefined) { // if suspended
          return this.waitTokensAndDoRequest(req, next).pipe(catchError(this.handlePostRefreshRequest));
        }

        if (tokens.refreshToken == undefined) {
          return throwError(Error('unauthorized'));
        }

        // suspend future requests
        this.tokens$.next(undefined);
        return this.currentUserService.refreshTokens(tokens.refreshToken)
          .pipe(
            switchMap(() => this.waitTokensAndDoRequest(req, next)),
            catchError(this.handlePostRefreshRequest)
          );
      })
    );
  }

// tslint:disable-next-line:no-any
  private waitTokensAndDoRequest(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/restaurant/refresh')) {
      return next.handle(req);
    }
    return this.tokens$.pipe(
      filter(auth => auth != undefined) as OperatorFunction<Tokens | undefined | null, Tokens>,
      first(),
      switchMap((tokens: Tokens) => {
        if (tokens.accessToken == undefined) {
          return next.handle(req);
        }
        const authReq = req.clone({
          headers: new HttpHeaders({
            Authorization: `Bearer ${tokens.accessToken}`, 'Content-Type': 'application/json'
          })
        });
        return next.handle(authReq);
      })
    );
  }

  private handlePostRefreshRequest = (error: Error) => {
    if (!(error instanceof HttpErrorResponse && error.status === 401)) {
      return throwError(error);
    }
    this.currentUserService.logout();
    return throwError(Error('You need to login'));
  }
}

export function authInterceptorFactory(currentUserService: CurrentUserService) {
  return new HttpAuthInterceptor(currentUserService);
}

export const HTTP_AUTH_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useFactory: authInterceptorFactory,
  multi: true,
  deps: [CurrentUserService]
};
