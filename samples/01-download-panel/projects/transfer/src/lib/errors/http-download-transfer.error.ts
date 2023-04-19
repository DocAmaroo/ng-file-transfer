import { HttpErrorResponse } from '@angular/common/http';
import { blobToJSON } from '../utils';

export class HttpDownloadTransferError extends HttpErrorResponse {
  constructor(httpErr: HttpErrorResponse) {
    const errorJson = blobToJSON(httpErr.error);
    super({
      error: errorJson,
      headers: httpErr.headers,
      status: httpErr.status,
      statusText: httpErr.statusText,
    });
  }
}
