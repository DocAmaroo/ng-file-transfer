import { HttpEvent, HttpResponse } from '@angular/common/http';
import { TransferState } from '../enums';
import { isHttpHeaderResponse, isHttpProgressEvent, isHttpResponse } from '../guards';

export class HttpTransfer<Res = any> {
  state: TransferState;
  total: number;
  loaded: number;
  response?: HttpResponse<Res>;

  constructor() {
    this.state = TransferState.Created;
    this.total = 0;
    this.loaded = 0;
  }

  handleHttpEvent(event: HttpEvent<Res>) {
    if (isHttpHeaderResponse(event)) {
      this.state = TransferState.Pending;
    }

    if (isHttpProgressEvent(event)) {
      this.state = TransferState.InProgress;
      if (event.loaded) this.loaded = event.loaded;
      if (event.total) this.total = event.total;
    }

    if (isHttpResponse(event)) {
      this.state = TransferState.Complete;
      this.response = event;
    }
  }

  getProgression() {
    if (!this.loaded || !this.total) return null;
    return (100 * this.loaded) / this.total;
  }

  isLazy() {
    return (
      this.state !== TransferState.Canceled &&
      this.state !== TransferState.Complete &&
      this.state !== TransferState.Failed
    );
  }

  isBusy() {
    return this.state === TransferState.Pending || this.state === TransferState.InProgress;
  }

  isFulfilled(): boolean {
    return !this.isLazy();
  }

  /**
   * Check the file transfer has been interrupted.
   * A transfer is interrupted if it has been canceled or has failed.
   */
  hasBeenInterrupted() {
    return this.state === TransferState.Failed || this.state === TransferState.Canceled;
  }
}
