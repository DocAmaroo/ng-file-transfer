import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FileTransferService, HttpFileTransferService } from '../../projects/transfer/src/lib';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TransferPanelModule } from './shared/components/transfer-panel/transfer-panel.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    TransferPanelModule,
    MatBottomSheetModule,
    MatButtonModule,
  ],
  providers: [FileTransferService, HttpFileTransferService],
  bootstrap: [AppComponent],
})
export class AppModule {}
