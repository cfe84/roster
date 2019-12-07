import { EventBus, IEvent } from "../events";
import { IReplicationAdapter } from "./IReplicationAdapter";

export class ReplicationManager {
  constructor(private eventBus: EventBus, private adapter: IReplicationAdapter) {
    this.registerHandler();
  }

  onEventAsync = async (event: IEvent) => {
    await this.adapter.replicateEventAsync(event);
  }

  private registerHandler() {
    this.eventBus.subscribeToAll(this.onEventAsync);
  }
}