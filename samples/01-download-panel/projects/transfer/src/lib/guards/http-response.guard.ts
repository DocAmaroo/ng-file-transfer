import { HttpErrorResponse } from '@angular/common/http';

export function isHttpErrorBlobResponse(err: HttpErrorResponse): err is HttpErrorResponse {
  return err.error instanceof Blob && err.error.type === 'application/json';
}
