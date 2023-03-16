import { TRANSFER_STATE, TransferState } from '../enums';
import { HttpEvent, HttpResponse } from '@angular/common/http';
import { isHttpHeaderResponse, isHttpProgressEvent, isHttpResponse } from '../guards';

export abstract class HttpFileTransfer<T = any> {
  protected constructor(bytesToTransfer?: number) {
    this._state = TRANSFER_STATE.Pending;
    this._bytesLoaded = 0;
    this._bytesToTransfer = bytesToTransfer;
  }

  /**
   * The state of the HTTP transfer.
   */
  private _state: TransferState;

  get state() {
    return this._state;
  }

  set state(value: TransferState) {
    this._state = value;
  }

  /**
   * The number of bytes uploaded or downloaded.
   */
  private _bytesLoaded?: number;

  set bytesLoaded(value: number) {
    this._bytesLoaded = value;
  }

  /**
   * The number of bytes to transfer
   */
  private _bytesToTransfer?: number;

  set bytesToTransfer(value: number) {
    this._bytesToTransfer = value;
  }

  /**
   * The HTTP response.
   * Can be null until the transfer complete.
   * @private
   */
  protected _response?: HttpResponse<T>;

  get response() {
    return this._response;
  }

  set response(value: HttpResponse<T>) {
    this._response = value;
  }

  getProgression() {
    if (!this._bytesToTransfer) return null;
    return (100 * this._bytesLoaded) / this._bytesToTransfer;
  }

  handleHttpEvent(event: HttpEvent<T>) {
    if (isHttpProgressEvent(event)) {
      this.state = TRANSFER_STATE.InProgress;
      this.bytesLoaded = event.loaded;
      this.bytesToTransfer = event.total;
    }

    if (isHttpHeaderResponse(event)) {
      this.state = TRANSFER_STATE.Pending;
    }

    if (isHttpResponse(event)) {
      this.state = TRANSFER_STATE.Complete;
      this.response = event;
    }
  }
}

export class HttpDownloadTransfer extends HttpFileTransfer<Blob> {
  constructor() {
    super();
  }

  /**
   * Returns the file from the response body.
   * Can be null until the transfer complete or no file was returned.
   */
  getFile(): Blob | null {
    return this._response.body || null;
  }

  /**
   * Parse the Content-Disposition header from the HTTP response to retrieve the filename.
   * @returns the filename or undefined if none found.
   */
  getFilename(): string | undefined {
    if (!this.response) return;

    const disposition = this.response.headers.get('Content-Disposition');
    if (!disposition) return;

    const match = disposition.match(/filename="(.*)"/);
    return match[1];
  }
}

export class HttpUploadTransfer<T = any> extends HttpFileTransfer<T> {
  /**
   * The name of the file being uploaded.
   * Is null if none provided.
   * @private
   */
  private _filename?: string;

  constructor(filename?: string) {
    super();
    this._filename = filename;
  }

  /**
   * Returns the response body.
   * Can be null until the transfer complete or nothing has been returned.
   */
  getBody(): T | null {
    return this._response.body || null;
  }
}
