import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FileProgressBarComponent } from './file-progress-bar.component';

@NgModule({
  declarations: [FileProgressBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [FileProgressBarComponent],
})
export class FileProgressBarModule {}
