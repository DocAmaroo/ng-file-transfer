import { Component, OnInit } from '@angular/core';
import { FileTransferService, Queue, Transfer } from '../../../projects/transfer/src/lib';

@Component({
  selector: 'app-transfer-panel',
  templateUrl: './transfer-panel.component.html',
  styleUrls: ['./transfer-panel.component.scss'],
})
export class TransferPanelComponent implements OnInit {
  queue: Queue;
  ongoing: Queue;

  constructor(private readonly fileService: FileTransferService) {
    this.queue = this.fileService.queue;
    this.ongoing = this.fileService.ongoing;
  }

  ngOnInit(): void {}

  cancel(transfer: Transfer) {
    this.fileService.cancel(transfer);
  }
}
