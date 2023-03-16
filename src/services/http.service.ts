import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { HttpOptions, HttpUploadTransfer } from '../types';
import { download, upload } from '../pipes';
import { catchError, Observable } from 'rxjs';
import { isHttpErrorBlobResponse } from '../guards/http-response.guard';
import { HttpDownloadTransferError } from '../errors/http-download-transfer.error';

@Injectable()
export class HttpService {
  constructor(private readonly _http: HttpClient) {}

  get<T = any>(req: HttpRequest<T>) {
    return this._http
      .get(req.url, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
        responseType: 'blob',
      })
      .pipe(
        download(),
        catchError((err) => {
          if (isHttpErrorBlobResponse(err)) throw new HttpDownloadTransferError(err);
          throw err;
        }),
      );
  }

  post<T = any>(req: HttpRequest<any>): Observable<HttpUploadTransfer<T>> {
    return this._http
      .post<T>(req.url, req.body, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(upload(req.body.get('file')));
  }

  put<T = any>(req: HttpRequest<any>): Observable<HttpUploadTransfer<T>> {
    return this._http
      .put<T>(req.url, req.body, {
        ...HttpOptions.fromRequest(req),
        observe: 'events',
        reportProgress: true,
      })
      .pipe(upload(req.body.get('file')));
  }
}
