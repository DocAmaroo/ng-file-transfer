import { HttpEvent, HttpRequest } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { TransferState } from '../enums';
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
    this.value.handleHttpEvent(event);
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
