import { IEvent } from "../events";

export interface IReplicationAdapter {
  sendEventAsync(event: IEvent): Promise<void>;
  startReceivingEventsAsync(): Promise<void>;
  stopReceivingEventsAsync(): Promise<void>;
  onEventReceivedAsync(event: IEvent): Promise<void>;
}