export const QueueEventType = {
  Created: 'queue-created',
  Add: 'transfer-added',
  Selected: 'transfer-selected',
  Removed: 'transfer-removed',
  Canceled: 'transfer-canceled',
} as const;
export type QueueEventType = (typeof QueueEventType)[keyof typeof QueueEventType];
