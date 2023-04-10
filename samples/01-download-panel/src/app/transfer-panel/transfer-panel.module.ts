import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { FileProgressBarModule } from '../file-progress-bar/file-progress-bar.module';
import { TransferPanelComponent } from './transfer-panel.component';

@NgModule({
  declarations: [TransferPanelComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
    MatBadgeModule,
    FileProgressBarModule,
  ],
})
export class TransferPanelModule {}
