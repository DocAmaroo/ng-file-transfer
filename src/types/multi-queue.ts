import { HttpRequest } from '@angular/common/http';
import { Queue } from './queue';
import { Transfer } from './transfer';

export interface TransferMultiQueueOptions {
  maxConcurrency?: number;
}

export class MultiQueue {
  readonly MAX_CONCURRENCY: number;
  readonly stack = new Queue();
  readonly ongoing = new Queue();

  constructor(options: TransferMultiQueueOptions = {}) {
    this.MAX_CONCURRENCY = options.maxConcurrency || 5;
  }

  request<Res = any, Req = any>(request: HttpRequest<Req>) {
    const transfer = new Transfer<Res, Req>(request);
    this.stack.add(transfer);
    this.next();
    return transfer;
  }

  cancel(transfer: Transfer) {
    this.ongoing.cancel(transfer);
  }

  next() {
    if (this.ongoing.getSize() >= this.MAX_CONCURRENCY) return;

    const next = this.stack.next();
    if (!next) return;

    this.ongoing.add(next);
  }
}
