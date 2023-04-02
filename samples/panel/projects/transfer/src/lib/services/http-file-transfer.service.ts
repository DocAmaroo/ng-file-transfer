import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { HttpDownloadTransferError } from '../errors';
import { isHttpErrorBlobResponse } from '../guards/http-response.guard';
import { upload } from '../pipes';
import { HttpOptions, HttpTransfer } from '../types';

@Injectable()
export class HttpFileTransferService {
  constructor(private readonly http: HttpClient) {}

  get<T = any>(req: HttpRequest<T>) {
    return this.http
      .get(req.url, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
        responseType: 'blob',
      })
      .pipe(
        catchError((err) => {
          if (isHttpErrorBlobResponse(err)) {
            throw new HttpDownloadTransferError(err);
          }

          throw err;
        }),
      );
  }

  post<T = any>(req: HttpRequest<any>): Observable<HttpTransfer<T>> {
    return this.http
      .post<T>(req.url, req.body, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(upload());
  }

  put<T = any>(req: HttpRequest<any>): Observable<HttpTransfer<T>> {
    return this.http
      .put<T>(req.url, req.body, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(upload());
  }
}
