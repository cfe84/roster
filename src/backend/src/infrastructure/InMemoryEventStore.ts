import { IEventStore } from "../Storage/IEventStore";
import { IEvent } from "../../lib/common/events";

export class MemoryEventStore implements IEventStore {
  async storeEventAsync(event: IEvent): Promise<void> {
    console.log(`Storing: ${JSON.stringify(event)}`);
  }
}