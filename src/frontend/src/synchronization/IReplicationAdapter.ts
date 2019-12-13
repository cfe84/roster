import { IEvent } from "../../lib/common/events/";

export interface IReplicationAdapter {
  sendEventAsync(event: IEvent): Promise<void>;
  startReceivingEventsAsync(): Promise<void>;
  stopReceivingEventsAsync(): Promise<void>;
  onEventReceivedAsync(event: IEvent): Promise<void>;
}