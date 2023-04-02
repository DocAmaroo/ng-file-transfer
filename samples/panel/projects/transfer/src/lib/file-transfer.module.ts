import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { HttpFileTransferService } from './services';

@NgModule({
  imports: [HttpClientModule],
  providers: [HttpFileTransferService],
})
export class AppModule {}
