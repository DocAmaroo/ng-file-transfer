/**
 * The different state of file transfer
 */
export const TRANSFER_STATE = {
  Pending: 'PENDING',
  InQueue: 'IN_QUEUE',
  InProgress: 'IN_PROGRESS',
  Complete: 'COMPLETE',
  Failed: 'FAILED',
  Canceled: 'CANCELED',
} as const;

export type TransferState = (typeof TRANSFER_STATE)[keyof typeof TRANSFER_STATE];
