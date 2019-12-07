import { IEvent } from "../events";

export interface IReplicationAdapter {
  replicateEventAsync(event: IEvent): Promise<void>;
}