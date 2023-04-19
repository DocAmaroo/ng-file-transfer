import { HttpEvent, HttpResponse } from '@angular/common/http';
import { TransferState } from '../enums';
import { isHttpHeaderResponse, isHttpProgressEvent, isHttpResponse } from '../guards';

export class HttpTransfer<Res = any> {
  state: TransferState;
  loaded: number;
  total: number;
  percent: number;
  response?: HttpResponse<Res>;

  constructor() {
    this.state = TransferState.Created;
    this.loaded = 0;
    this.total = 0;
    this.percent = 0;
  }

  handleHttpEvent(event: HttpEvent<Res>) {
    if (isHttpHeaderResponse(event)) {
      this.state = TransferState.Pending;
    }

    if (isHttpProgressEvent(event)) {
      this.state = TransferState.InProgress;
      this.loaded = event.loaded || 0;
      this.total = event.total || 0;
      this.percent = this.computePercent();
    }

    if (isHttpResponse(event)) {
      this.state = TransferState.Complete;
      this.response = event;
    }
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

  private computePercent(): number {
    if (!this.loaded || !this.total) return 0;
    return (100 * this.loaded) / this.total;
  }
}
