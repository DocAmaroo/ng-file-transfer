import { Observable, scan } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { HttpDownloadTransfer } from '../types';

/**
 * Watch on the download events.
 * @returns the download progression as an Observable.
 */
export function download(): (source: Observable<HttpEvent<Blob>>) => Observable<HttpDownloadTransfer> {
  return (source) => source.pipe(scan(downloadProgress, new HttpDownloadTransfer()));
}

/**
 * Watch on http download progress event to calculate the current bytes loaded.
 * @param download The http transfer.
 * @param event The http event.
 * @returns the http transfer updated by the event.
 */
const downloadProgress = (download: HttpDownloadTransfer, event: HttpEvent<Blob>): HttpDownloadTransfer => {
  download.handleHttpEvent(event);
  return download;
};
