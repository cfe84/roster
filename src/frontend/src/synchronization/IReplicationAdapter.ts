import { IEvent } from "../../lib/common/events/";

export interface IReplicationAdapter {
  connectAsync(): Promise<void>;
  sendEventAsync(event: IEvent): Promise<void>;
  onEventReceivedAsync(event: IEvent): Promise<void>;
}