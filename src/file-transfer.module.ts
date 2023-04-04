import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FileTransferService } from './services';

@NgModule({
  imports: [HttpClientModule],
  providers: [FileTransferService],
})
export class FileTransferModule {}
