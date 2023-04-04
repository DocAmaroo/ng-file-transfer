import { BehaviorSubject, Subject } from 'rxjs';
import { QueueEvent } from './queue-event';
import { Transfer } from './transfer';
import { TransferId } from './transfer-id';

export class Queue {
  readonly size$: BehaviorSubject<number>;
  readonly transfers$: BehaviorSubject<Transfer[]>;
  readonly events$: Subject<QueueEvent>;
  private transfers: Transfer[];
  private size: number;

  constructor() {
    this.size = 0;
    this.size$ = new BehaviorSubject(this.size);

    this.transfers = [];
    this.transfers$ = new BehaviorSubject(this.transfers);

    this.events$ = new BehaviorSubject<QueueEvent>(QueueEvent.created());
  }

  add(transfer: Transfer) {
    this.transfers.push(transfer);
    this.refreshTransfers();
    this.emitEvent(QueueEvent.add(transfer.id));
  }

  findById(id: TransferId): Transfer | undefined {
    return this.transfers.find((t) => t.id === id);
  }

  next(): Transfer | undefined {
    const next = this.transfers.shift();
    if (!next) return;

    this.refreshTransfers();
    this.emitEvent(QueueEvent.selected(next.id));
    return next;
  }

  cancel(transfer: Transfer) {
    transfer.cancel();
    this.emitEvent(QueueEvent.canceled(transfer.id));
    this.remove(transfer);
  }

  remove(transfer: Transfer): Transfer | undefined {
    const index = this.transfers.findIndex((t) => t.id === transfer.id);
    if (!index) return;

    const splice = this.transfers.splice(index, 1);
    if (!splice.length) return;

    const removed = splice[0];
    if (removed.observed) removed.unsubscribe();
    this.refreshTransfers();

    this.emitEvent(QueueEvent.removed(removed.id));
    return removed;
  }

  getSize() {
    return this.size;
  }

  private setSize(size: number) {
    this.size = size;
    this.size$.next(size);
  }

  private refreshSize() {
    this.setSize(this.transfers.length);
  }

  private setTransfers(transfers: Transfer[]) {
    this.transfers = transfers;
    this.transfers$.next(this.transfers);
    this.refreshSize();
  }

  private refreshTransfers() {
    this.setTransfers(this.transfers);
  }

  private emitEvent(event: QueueEvent) {
    this.events$.next(event);
  }
}
