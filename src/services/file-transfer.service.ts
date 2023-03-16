import { Injectable } from '@angular/core';

import { BehaviorSubject, finalize, Observer, takeWhile } from 'rxjs';
import {
  DownloadTransfer,
  HttpDownloadTransfer,
  HttpFileTransfer,
  HttpUploadTransfer,
  Item,
  MultiQueue,
  UploadTransfer,
} from '../types';
import { HttpService } from './http.service';
import { FileTransferFailedError } from '../errors';
import { TRANSFER_STATE } from '../enums';
import { isDownloadTransfer } from '../guards/transfer.guard';

@Injectable()
export class FileTransferService {
  downloadQueue: MultiQueue<DownloadTransfer>;
  uploadQueue: MultiQueue<UploadTransfer>;
  size$: BehaviorSubject<number>;

  constructor(private readonly _httpService: HttpService) {
    this.downloadQueue = new MultiQueue<DownloadTransfer>();
    this.uploadQueue = new MultiQueue<UploadTransfer>();
    this.size$ = new BehaviorSubject<number>(0);
    this._listenQueues();
  }

  addToQueue<T>(transfer: DownloadTransfer | UploadTransfer<T>) {
    let item: any;

    if (isDownloadTransfer(transfer)) {
      item = new Item<DownloadTransfer>(transfer);
      this.downloadQueue.addItem(item);
    } else {
      item = new Item<UploadTransfer<T>>(transfer);
      this.uploadQueue.addItem(item);
    }

    return item;
  }

  cancel(item: Item<DownloadTransfer | UploadTransfer>) {
    item.cancel();
  }

  refreshSize(): void {
    this.size$.next(this.downloadQueue.size$.getValue() + this.uploadQueue.size$.getValue());
  }

  get(item: Item<DownloadTransfer>): void {
    this._httpService
      .get(item.value.request)
      .pipe(
        takeWhile(() => item.value.isPending()),
        finalize(() => this.downloadQueue.findNext()),
      )
      .subscribe(this._handleResponse(item));
  }

  post<T = any>(item: Item<UploadTransfer>) {
    return this._httpService
      .post<T>(item.value.request)
      .pipe(
        takeWhile(() => item.value.isPending()),
        finalize(() => this.uploadQueue.findNext()),
      )
      .subscribe(this._handleResponse(item));
  }

  put<T = any>(item: Item<UploadTransfer>) {
    return this._httpService
      .put<T>(item.value.request)
      .pipe(
        takeWhile(() => item.value.isPending()),
        finalize(() => this.uploadQueue.findNext()),
      )
      .subscribe(this._handleResponse(item));
  }

  private _listenQueues() {
    this.downloadQueue.events$.subscribe((event) => {
      if (event.type === 'transfer-to-proceed') this._executeDownload(event.item);
    });

    this.uploadQueue.events$.subscribe((event) => {
      if (event.type === 'transfer-to-proceed') this._executeUpload(event.item);
    });

    this.downloadQueue.size$.subscribe(() => this.refreshSize());
    this.uploadQueue.size$.subscribe(() => this.refreshSize());
  }

  private _executeDownload(item: Item<DownloadTransfer>) {
    return this.get(item);
  }

  private _executeUpload(item: Item<UploadTransfer>) {
    const httpMethod = item.value.getHttpMethod().toUpperCase();
    if (httpMethod === 'POST') return this.post(item);
    if (httpMethod === 'PUT') return this.put(item);
    throw new Error(`The http method ${httpMethod} is unknown are not handled.`);
  }

  /**
   * Handle file transfer subscription
   * @param item
   * @private
   */
  private _handleResponse<T extends DownloadTransfer | UploadTransfer>(
    item: Item<T>,
  ): Partial<Observer<HttpFileTransfer>> {
    return {
      next: (response: HttpDownloadTransfer | HttpUploadTransfer) => {
        item.value.response = response;
      },
      error: (err) => {
        item.setState(TRANSFER_STATE.Failed);
        throw new FileTransferFailedError(err);
      },
      complete: () => {
        if (!item.value.hasBeenInterrupted()) {
          item.setState(TRANSFER_STATE.Complete);
        }
      },
    };
  }
}
