import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Subscription, takeWhile } from 'rxjs';
import { Transfer, TransferState } from '../../../../../projects/transfer/src/lib';

@Component({
  selector: 'app-file-progress-bar',
  templateUrl: './file-progress-bar.component.html',
  styleUrls: ['./file-progress-bar.component.scss'],
})
export class FileProgressBarComponent implements OnChanges, OnDestroy {
  @Input() transfer!: Transfer;

  state: ProgressBarMode = 'determinate';
  subscription: Subscription | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transfer']) {
      this.transfer = changes['transfer'].currentValue;
      this.subscription = this.transfer
        .pipe(takeWhile((value) => value.isLazy()))
        .subscribe((value) => {
          this.state = this.asProgressBarMode(value.state);
        });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Sets the progress bar mode by the file transfer state.
   */
  private asProgressBarMode(state: TransferState): ProgressBarMode {
    switch (state) {
      case TransferState.Created:
        return 'buffer';
      case TransferState.Pending:
        return 'query';
      case TransferState.InQueue:
        return 'indeterminate';
      case TransferState.InProgress:
      case TransferState.Canceled:
      case TransferState.Failed:
      case TransferState.Complete:
        return 'determinate';
      default:
        return 'query';
    }
  }
}
