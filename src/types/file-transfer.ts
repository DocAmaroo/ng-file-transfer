import { TRANSFER_STATE, TransferState } from '../enums';
import { HttpRequest } from '@angular/common/http';
import { HttpDownloadTransfer, HttpUploadTransfer } from './http-file-transfer';

export abstract class FileTransfer<T = any> {
  readonly request: HttpRequest<T>;

  protected constructor(request: HttpRequest<T>) {
    this._state = TRANSFER_STATE.Pending;
    this.request = request;
  }

  private _state: TransferState;

  get state() {
    return this._state;
  }

  set state(value: TransferState) {
    this._state = value;
  }

  getHttpMethod() {
    return this.request.method;
  }

  isPending() {
    return this.state === TRANSFER_STATE.Pending;
  }

  /**
   * Check if the transfer has ended by any way.
   * A transfer is ended if it has completed, canceled or failed.
   */
  isEnded() {
    return (
      this.state === TRANSFER_STATE.Canceled ||
      this.state === TRANSFER_STATE.Failed ||
      this.state === TRANSFER_STATE.Complete
    );
  }

  /**
   * Check the file transfer has been interrupted.
   * A transfer is interrupted if it has been canceled or has failed.
   */
  hasBeenInterrupted(): boolean {
    return this.state === TRANSFER_STATE.Canceled || this.state === TRANSFER_STATE.Failed;
  }
}

export class DownloadTransfer extends FileTransfer<Blob> {
  constructor(request: HttpRequest<Blob>) {
    super(request);
    this._response = new HttpDownloadTransfer();
  }

  private _response: HttpDownloadTransfer;

  get response() {
    return this._response;
  }

  set response(value: HttpDownloadTransfer) {
    this._response = value;
  }
}

export class UploadTransfer<T = any> extends FileTransfer<T> {
  /**
   * The name of the file to upload.
   * @private
   */
  private readonly _filename?: string;

  constructor(request: HttpRequest<T>, filename?: string) {
    super(request);
    this._filename = filename ?? undefined;
    this._response = new HttpUploadTransfer(filename);
  }

  private _response: HttpUploadTransfer;

  get response() {
    return this._response;
  }

  set response(value: HttpUploadTransfer) {
    this._response = value;
  }
}
