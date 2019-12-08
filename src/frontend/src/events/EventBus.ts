import { IEvent } from "./IEvent";
import { SubscriptionRecord } from "./SubscriptionRecord";

const CATCH_ALL = "CATCH_ALL";
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
  private log(message: string) {
    if (this.debug) {
      console.info(message);
    }
  }

  constructor(private debug: boolean = false) {
  }

  private subscriptions = new Subscriptions();
  private subscriptionRecords = new SubscriptionRecordList();

  async publishAsync(event: IEvent): Promise<void> {
    this.log(`Eventbus - publishing event ${event.info.type}: ${JSON.stringify(event, null, 2)}`);
    await this.callHandlersForType(event.info.type, event);
    await this.callHandlersForType(CATCH_ALL, event);
  }

  private async callHandlersForType(type: string, event: IEvent) {
    const handlers = this.subscriptions[type];
    if (handlers) {
      for (let id in handlers) {
        this.log(`Eventbus - calling handler ${id}`);
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
    const record = new SubscriptionRecord(eventType, handler, this);
    this.subscriptions[eventType][record.id] = handler as eventHandler<IEvent>;
    this.subscriptionRecords[record.id] = record as SubscriptionRecord<IEvent>;
    this.log(`Eventbus - created subscription ${record.id} to event type ${eventType}`);
    return record;
  }

  subscribeToAll = (handler: eventHandler<IEvent>): SubscriptionRecord<IEvent> =>
    this.subscribe(CATCH_ALL, handler)

  unsubscribe<T extends IEvent>(record: SubscriptionRecord<T>) {
    const subsForType = this.subscriptions[record.type];
    delete subsForType[record.id];
    delete this.subscriptionRecords[record.id];
    this.log(`Eventbus - deleted subscription ${record.id} from event type ${record.type}`);
  }
}