import { IEvent } from "./IEvent";
import { SubscriptionRecord } from "./SubscriptionRecord";

type syncEventHandler<T extends IEvent> = ((event: T) => void);
type asyncEventHandler<T extends IEvent> = ((event: T) => Promise<void>);
export type eventHandler<T extends IEvent> = syncEventHandler<T> | asyncEventHandler<T>;
export type eventType = string;

class SubscriptionList {
  [id: string]: eventHandler<IEvent>
}

class SubscriptionRecordList {
  [id: string]: SubscriptionRecord<IEvent>
}

class Subscriptions {
  [eventType: string]: SubscriptionList
}

export class EventBus {
  private subscriptions = new Subscriptions();
  private subscriptionRecords = new SubscriptionRecordList();

  async publishAsync(event: IEvent): Promise<void> {
    const handlers = this.subscriptions[event.type];
    if (handlers) {
      for (let id in handlers) {
        const handler = handlers[id];
        await Promise.resolve(handler(event));
      }
    }
  }

  subscribe<T extends IEvent>(eventType: eventType,
    handler: eventHandler<T>): SubscriptionRecord<T> {
    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = new SubscriptionList();
    }
    const record = new SubscriptionRecord(eventType, handler);
    this.subscriptions[eventType][record.id] = handler as eventHandler<IEvent>;
    this.subscriptionRecords[record.id] = record as SubscriptionRecord<IEvent>;
    return record;
  }

  unsubscribe<T extends IEvent>(subscriptionRecord: SubscriptionRecord<T>) {
    const subsForType = this.subscriptions[subscriptionRecord.type];
    delete subsForType[subscriptionRecord.id];
    delete this.subscriptionRecords[subscriptionRecord.id];
  }
}