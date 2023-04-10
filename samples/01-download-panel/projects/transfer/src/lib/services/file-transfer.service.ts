import { HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observer } from 'rxjs';
import { FileTransferFailedError } from '../errors';
import { HttpTransfer, Queue, Transfer } from '../types';
import { QueueEventType } from '../types/queue-event';
import { HttpFileTransferService } from './http-file-transfer.service';

@Injectable()
export class FileTransferService {
  readonly MAX_CONCURRENCY = 5;
  readonly queue: Queue;
  readonly ongoing: Queue;

  constructor(private readonly httpService: HttpFileTransferService) {
    this.queue = new Queue();
    this.ongoing = new Queue();
    this.listenEvents();
  }

  newTransfer<Res = any, Req = any>(request: HttpRequest<Req>) {
    const transfer = new Transfer<Res, Req>(request);
    this.queue.add(transfer);
    this.next();
    return transfer;
  }

  cancel(transfer: Transfer) {
    this.queue.cancel(transfer);
  }

  private next() {
    if (this.ongoing.getSize() >= this.MAX_CONCURRENCY) return;

    const next = this.queue.next();
    if (!next) return;

    this.ongoing.add(next);
  }

  private listenEvents() {
    this.ongoing.events$.subscribe((event) => {
      if (event.type === QueueEventType.Add && event.transferId) {
        const transfer = this.ongoing.findById(event.transferId);
        if (!transfer) return;

        this.get(transfer);
      }
    });
  }

  private get(transfer: Transfer<HttpTransfer>): void {
    this.httpService
      .get(transfer.request)
      .pipe(finalize(() => this.finalizeTransfer(transfer)))
      .subscribe(this.handleResponse<Blob>(transfer));
  }

  /**
   * Handle file transfer subscription
   * @private
   * @param transfer
   */
  private handleResponse<Res>(transfer: Transfer<HttpTransfer>): Partial<Observer<HttpEvent<Res>>> {
    return {
      next: (event: HttpEvent<Res>) => {
        transfer.handleHttpEvent(event);
      },
      error: (err) => {
        transfer.failed();
        throw new FileTransferFailedError(err);
      },
      complete: () => {
        if (!transfer.hasBeenInterrupted()) {
          transfer.done();
        }
      },
    };
  }

  private finalizeTransfer(transfer: Transfer) {
    this.ongoing.remove(transfer);
    this.next();
  }
}
