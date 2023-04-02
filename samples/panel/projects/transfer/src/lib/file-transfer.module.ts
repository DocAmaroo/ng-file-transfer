import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpFileTransferService } from './services/http-file-transfer.service';

@NgModule({
  imports: [HttpClientModule],
  providers: [HttpFileTransferService],
})
export class AppModule {}
