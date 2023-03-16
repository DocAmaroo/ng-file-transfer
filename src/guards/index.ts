import { HttpEvent, HttpEventType, HttpHeaderResponse, HttpProgressEvent, HttpResponse } from '@angular/common/http';

/**
 * Check if the event is an HttpResponse.
 * @param event The Http event.
 */
export function isHttpResponse<T>(event: HttpEvent<T>): event is HttpResponse<T> {
  return event.type === HttpEventType.Response;
}

/**
 * Check is the event is an HttpProgressEvent (Download/Upload)
 * @param event The Http event.
 */
export function isHttpProgressEvent(event: HttpEvent<unknown>): event is HttpProgressEvent {
  return event.type === HttpEventType.DownloadProgress || event.type === HttpEventType.UploadProgress;
}

/**
 * Check is the event is an HttpHeaderResponse
 * @param event The Http event.
 */
export function isHttpHeaderResponse(event: HttpEvent<unknown>): event is HttpHeaderResponse {
  return event.type === HttpEventType.ResponseHeader;
}
