import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TRANSFER_STATE, TransferState } from '../enums';
import { FileTransfer } from './file-transfer';
import { QueueEvent } from './queue-event';

export class Item<T extends FileTransfer> extends BehaviorSubject<T> {
  constructor(props: T) {
    super(props);
  }

  setState(state: TransferState) {
    this.value.state = state;
    this.next(this.value);
  }

  /**
   * Change the state to CANCELED
   */
  cancel() {
    this.setState(TRANSFER_STATE.Canceled);
  }
}

export class Queue<T extends FileTransfer> {
  /**
   * The queue size as observable
   */
  readonly size$: BehaviorSubject<number>;
  readonly events$: Observable<QueueEvent>;
  /**
   * The queue items
   * @private
   */
  private _items: Item<T>[];
  private readonly items$: BehaviorSubject<Item<T>[]>;

  constructor() {
    this._items = [];
    this.items$ = new BehaviorSubject(this._items);
    this.size$ = new BehaviorSubject(0);
    this.events$ = new Observable<QueueEvent>();
  }

  /**
   * Set the next value from the queue.
   * Also, it refreshes the total queue size;
   * @param items
   */
  setItems(items: Item<T>[]) {
    items = items.filter((item) => !item.value.isEnded());
    this.items$.next(items);
    this.refreshSize();
  }

  /**
   * Add an item to the progress queue.
   * @param item
   */
  addItem(item: Item<T>): void {
    this._items.push(item);
    this.setItems(this._items);
  }

  /**
   * Return the first element of the list.
   * If the list is empty, undefined is returned.
   */
  findNext(): Item<T> | undefined {
    const item = this._items.shift();
    if (item) this.setItems(this._items);
    return item;
  }

  /**
   * Remove all transfer that has complete, failed or has been canceled
   * from the progress queue
   */
  cleanup(): void {
    this._items = this._items.filter((item) => item.value.isPending() || !item.value.isEnded());
    this.setItems(this._items);
  }

  /**
   * Reset the progress queue to an empty array.
   * Before the reset, it unsubscribes to each transfer
   */
  clear(): void {
    this._items.forEach((item) => {
      if (item.observed) item.unsubscribe();
    });
    this._items = [];
  }

  getSize() {
    return this.size$.value;
  }

  /**
   * Emit the new size value to the observable.
   */
  refreshSize() {
    this.size$.next(this._items.length);
  }
}

/**
 * Represent a multi line queue. It is composed of :
 * - `progressQueue`: The file transfer currently in progress.
 * - `waitingQueue`: The file transfer waiting to be executed.
 *
 * A multi queue also specified a maximum of simultaneous transfer that can be
 * executed at the same time. By default, set as 5.
 */
export class MultiQueue<T extends FileTransfer> {
  /**
   * Observe the latest event of the queue.
   */
  readonly events$: Subject<QueueEvent>;
  /**
   * The progress queue.
   * Contain each transfer that are currently in progress.
   */
  readonly progressQueue: Queue<T>;
  /**
   * The waiting queue.
   * Contain each transfer waiting to be taken in charge.
   */
  readonly waitingQueue: Queue<T>;
  /**
   * The total number of transfer.
   * Add the progress and waiting transfer size queue
   */
  readonly size$: BehaviorSubject<number>;
  /**
   * The maximum of simultaneous transfer.
   * @private
   */
  private MAX_SIMULTANEOUS_TRANSFER = 5;

  constructor() {
    this.progressQueue = new Queue<T>();
    this.waitingQueue = new Queue<T>();
    this.size$ = new BehaviorSubject<number>(0);
  }

  /**
   * Add an item to the waiting queue.
   */
  addItem(item: Item<T>): void {
    this.waitingQueue.addItem(item);
    this._emitEvent(QueueEvent.New(item));
    this.refreshSize();
    this.findNext();
  }

  /**
   * Refresh the current total size
   */
  refreshSize() {
    this.size$.next(this.progressQueue.getSize() + this.waitingQueue.getSize());
  }

  /**
   * Find the next transfer to execute.
   * If the progress queue doesn't exceed the number of simultaneous transfer,
   * it will get the first element from the waiting queue and add it to the
   * progress queue. Otherwise, nothing happened.
   */
  findNext(): Item<T> | undefined {
    if (this.progressQueue.getSize() >= this.MAX_SIMULTANEOUS_TRANSFER) return;

    const item = this.waitingQueue.findNext();
    if (item) {
      this.addToProgressQueue(item);
      this._emitEvent(QueueEvent.Next(item));
    }

    return item;
  }

  /**
   * Add an item to the progress queue.
   * @param item
   * @private
   */
  private addToProgressQueue(item: Item<T>): void {
    item.setState(TRANSFER_STATE.InProgress);
    this.progressQueue.addItem(item);
  }

  private _emitEvent(event: QueueEvent) {
    this.events$.next(event);
  }
}
