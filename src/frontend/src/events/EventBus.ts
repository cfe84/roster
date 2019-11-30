import { IEvent } from "./IEvent";

type asyncEventHandler = ((event: IEvent) => Promise<void>);

class Subscriptions {
  [eventType: string]: asyncEventHandler[]
}

export class EventBus {
  private subscriptions = new Subscriptions();

  async publishAsync(event: IEvent): Promise<void> {
    const handlers = this.subscriptions[event.type];
    if (handlers) {
      for (let handlerAsync of handlers) {
        handlerAsync(event);
      }
    }
  }

  subscribe(eventType: string,
    asyncHandler: asyncEventHandler) {
    if (!this.subscriptions[eventType]) {
      this.subscriptions[eventType] = [];
    }
    this.subscriptions[eventType].push(asyncHandler);
  }
}