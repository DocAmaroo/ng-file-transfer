export const TransferState = {
  Created: 'CREATED',
  Pending: 'PENDING',
  InQueue: 'IN_QUEUE',
  InProgress: 'IN_PROGRESS',
  Complete: 'COMPLETE',
  Failed: 'FAILED',
  Canceled: 'CANCELED',
} as const;

export type TransferState = (typeof TransferState)[keyof typeof TransferState];
