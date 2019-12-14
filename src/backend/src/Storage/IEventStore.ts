import { IEvent } from "../../lib/common/events/IEvent"

export interface IEventStore {
  storeEventAsync(event: IEvent): Promise<void>
}