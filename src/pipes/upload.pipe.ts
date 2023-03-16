import { HttpUploadTransfer } from '../types';
import { HttpEvent } from '@angular/common/http';
import { Observable, scan } from 'rxjs';

/**
 * Watch on the upload events.
 * @returns the upload progression as an Observable.
 */
export function upload<T>(file?: File): (source: Observable<HttpEvent<any>>) => Observable<HttpUploadTransfer<T>> {
  return (source) => source.pipe(scan(uploadProgress, new HttpUploadTransfer(file?.name)));
}

/**
 * Watch on http upload progress event to calculate the current bytes loaded.
 * @param upload The http transfer.
 * @param event The http event.
 * @returns the http transfer updated by the event.
 */
const uploadProgress = (upload: HttpUploadTransfer, event: HttpEvent<any>): HttpUploadTransfer => {
  upload.handleHttpEvent(event);
  return upload;
};
