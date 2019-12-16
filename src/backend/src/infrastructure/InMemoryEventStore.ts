import { IAccountEventStore } from "../Storage/IAccountEventStore";
import { IEvent } from "../../lib/common/events";

export class MemoryEventStore implements IAccountEventStore {
  private store: any = {};
  async getEventsAsync(fromDateMs: number): Promise<IEvent[]> {
    const filtered = Object
      .keys(this.store)
      .filter((value) => parseInt(value) > fromDateMs)
      .map((key) => this.store[key]);
    return filtered;
  }
  async storeEventAsync(event: IEvent): Promise<void> {
    console.log(`Storing: ${event.info.date.getTime()}: ${JSON.stringify(event)}`);
    this.store[event.info.date.getTime().toString()] = event;
  }
}