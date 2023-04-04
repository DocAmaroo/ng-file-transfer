import { HttpRequest } from '@angular/common/http';
import { Component } from '@angular/core';
import { takeWhile } from 'rxjs';
import { FileTransferService } from '../../projects/transfer/src/lib/services';
import { Transfer } from '../../projects/transfer/src/lib/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'panel';
  transfer?: Transfer<Blob>;

  constructor(private readonly fileService: FileTransferService) {}

  download() {
    const request = new HttpRequest<string>('GET', 'http://localhost:8000');
    this.transfer = this.fileService.newTransfer<Blob>(request);
    this.transfer.pipe(takeWhile((dl) => dl.isLazy())).subscribe({
      next: (value) => console.log('download in progress', value),
      complete: () => console.log('download complete'),
    });
  }
}
