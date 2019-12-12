import { IEvent } from "../events";

export interface IReplicationAdapter {
  sendEventAsync(event: IEvent): Promise<void>;
  receiveEventsAsync(): Promise<IEvent[]>;
}