import { HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { FileTransferService, Transfer } from '../../projects/transfer/src/lib';
import { TransferPanelComponent } from './transfer-panel/transfer-panel.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  transfer$?: Transfer<Blob>;

  constructor(
    private readonly fileService: FileTransferService,
    private readonly matBottomSheet: MatBottomSheet,
  ) {}

  download() {
    const request = new HttpRequest<string>('GET', 'http://localhost:8000');
    this.transfer$ = this.fileService.newTransfer<Blob>(request);
  }

  openPanel() {
    this.matBottomSheet.open(TransferPanelComponent);
  }
}
