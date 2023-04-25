import { TransferId } from './transfer-id';

export const QueueEventType = {
  Created: 'queue-created',
  Add: 'transfer-added',
  Selected: 'transfer-selected',
  Removed: 'transfer-removed',
  Canceled: 'transfer-canceled',
} as const;

export type QueueEventType = (typeof QueueEventType)[keyof typeof QueueEventType];

export class QueueEvent {
  readonly type: QueueEventType;
  timestamp: number;
  transferId?: TransferId;

  constructor(type: QueueEventType, transferId?: TransferId) {
    this.type = type;
    this.timestamp = new Date().getTime();
    this.transferId = transferId;
  }

  static created() {
    return new QueueEvent(QueueEventType.Created);
  }

  static add(transferId?: TransferId) {
    return new QueueEvent(QueueEventType.Add, transferId);
  }

  static selected(transferId?: TransferId) {
    return new QueueEvent(QueueEventType.Selected, transferId);
  }

  static canceled(transferId?: TransferId) {
    return new QueueEvent(QueueEventType.Canceled, transferId);
  }

  static removed(transferId?: TransferId) {
    return new QueueEvent(QueueEventType.Removed, transferId);
  }
}
