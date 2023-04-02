import { HttpEvent } from '@angular/common/http';
import { Observable, scan } from 'rxjs';
import { HttpTransfer } from '../types';

/**
 * Watch on the upload events.
 * @returns the upload progression as an Observable.
 */
export function upload<T>(): (source: Observable<HttpEvent<any>>) => Observable<HttpTransfer<T>> {
  return (source) => source.pipe(scan(uploadProgress, new HttpTransfer()));
}

/**
 * Watch on http upload progress event to calculate the current bytes loaded.
 * @param upload The http transfer.
 * @param event The http event.
 * @returns the http transfer updated by the event.
 */
const uploadProgress = (upload: HttpTransfer, event: HttpEvent<any>): HttpTransfer => {
  upload.handleHttpEvent(event);
  return upload;
};
