import { IEventStore } from "../Storage/IEventStore";
import { IEvent } from "../../lib/common/events";
import { TableService } from "azure-storage";

export class TableStorageEventStore implements IEventStore {

  constructor(connectionString: string) {
    const tableService = new TableService(connectionString);
  }

  storeEventAsync(event: IEvent): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getEventsAsync(fromDate: number): Promise<IEvent[]> {
    throw new Error("Method not implemented.");
  }


}