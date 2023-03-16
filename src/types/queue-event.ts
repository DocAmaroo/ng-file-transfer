import { Item } from './file-transfer-queue';

export const QUEUE_EVENT_TYPE = {
  New: 'new-transfer',
  Next: 'transfer-to-proceed',
} as const;

export type QueueEventType = (typeof QUEUE_EVENT_TYPE)[keyof typeof QUEUE_EVENT_TYPE];

export class QueueEvent {
  readonly type: QueueEventType;
  item?: Item<any>;
  timestamp: number;

  constructor(type: QueueEventType, item?: Item<any>) {
    this.type = type;
    this.item = item;
    this.timestamp = new Date().getTime();
  }

  static New(item?: Item<any>) {
    return new QueueEvent(QUEUE_EVENT_TYPE.New, item);
  }

  static Next(item?: Item<any>) {
    return new QueueEvent(QUEUE_EVENT_TYPE.New, item);
  }
}
