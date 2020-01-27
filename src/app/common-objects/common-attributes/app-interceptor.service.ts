import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AppInterceptorService implements HttpInterceptor {
  constructor(private message: NzMessageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      Authorization: 'junlapunete',
    });

    const clone = request.clone({
      headers: headers,
    });

    return next.handle(clone).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          const errObj = error.error;
          const errTitle = errObj.name;
          const errMessage = errObj.message;

          this.message.error(`${errTitle}: ${errMessage}`, {
            nzDuration: 5000,
          });
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong

          const errObj = error.error;
          const errStatusCode = errObj.statusCode;
          const errTitle = errObj.error;
          const errMessage = errObj.message;
          this.message.error(`${errStatusCode} ${errTitle}: ${errMessage}`, {
            nzDuration: 5000,
          });
        }

        return EMPTY;
      }),
    );
  }
}
