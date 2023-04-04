import { HttpEvent, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TransferState } from '../enums';
import { isHttpHeaderResponse, isHttpProgressEvent, isHttpResponse } from '../guards';
import { HttpTransfer } from './http-transfer';
import { TransferId } from './transfer-id';

export class Transfer<Res = any, Req = any> extends BehaviorSubject<HttpTransfer<Res>> {
  id: TransferId;
  readonly request: HttpRequest<Req>;

  constructor(request: HttpRequest<Req>) {
    super(new HttpTransfer<Res>());
    this.request = request;
    this.id = TransferId();
  }

  handleHttpEvent(event: HttpEvent<any>) {
    if (isHttpHeaderResponse(event)) {
      this.value.state = TransferState.Pending;
    }

    if (isHttpProgressEvent(event)) {
      this.value.state = TransferState.InProgress;
      if (event.loaded) this.value.loaded = event.loaded;
      if (event.total) this.value.total = event.total;
    }

    if (isHttpResponse(event)) {
      this.value.state = TransferState.Complete;
      this.value.response = event;
    }

    this.emitChanges();
  }

  setState(state: TransferState) {
    this.value.state = state;
    this.emitChanges();
  }

  /**
   * Check the file transfer has been interrupted.
   * A transfer is interrupted if it has been canceled or has failed.
   */
  hasBeenInterrupted() {
    return this.value.hasBeenInterrupted();
  }

  done() {
    this.setState(TransferState.Complete);
  }

  cancel() {
    this.setState(TransferState.Canceled);
  }

  failed() {
    this.setState(TransferState.Failed);
  }

  private emitChanges() {
    this.next(this.value);
  }
}
