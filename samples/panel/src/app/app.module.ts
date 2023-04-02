import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  FileTransferService,
  HttpFileTransferService,
} from '../../projects/transfer/src/lib/services';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [FileTransferService, HttpFileTransferService],
  bootstrap: [AppComponent],
})
export class AppModule {}
