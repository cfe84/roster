import { IEventStore } from "../Storage/IEventStore";
import { IEvent } from "../../lib/common/events";

export class MemoryEventStore implements IEventStore {
  private store: IEvent[] = [];
  async getEventsAsync(fromDateMs: number): Promise<IEvent[]> {
    return this.store.filter((value, index) => index > fromDateMs);
  }
  async storeEventAsync(event: IEvent): Promise<void> {
    console.log(`Storing: ${JSON.stringify(event)}`);
    this.store[event.info.date.getTime()] = event;
  }
}