import { EventBus, IEvent } from "../events";
import { IReplicationAdapter } from "./IReplicationAdapter";
import { IQueue } from "./IEventQueue";
import { AsyncTimeout } from "../utils/AsyncTimeout";

export interface ReplicationManagerDependencies {
  eventBus: EventBus;
  adapter: IReplicationAdapter;
  queue: IQueue<IEvent>;
}

export class ReplicationManager {
  private timeout = new AsyncTimeout();
  private running = false;
  public intervalMs: number = 10000;
  constructor(private deps: ReplicationManagerDependencies) {
    this.registerHandler();
  }

  onSyncStarted = () => { }
  onSyncFinished = () => { }
  onReplicationStarted = () => { }
  onReplicationFinished = () => { }

  onEventAsync = async (event: IEvent) => {
    await this.deps.queue.pushAsync(event);
    this.syncNow();
  }

  public syncNow() {
    if (this.running && this.timeout.isRunning()) {
      this.timeout.abort();
    }
  }

  private processSendQueueAsync = async () => {
    while (await this.deps.queue.countAsync() > 0) {
      const message = await this.deps.queue.peekAsync();
      try {
        await this.deps.adapter.sendEventAsync(message.data);
      } catch (error) {
        console.error(error);
        return;
      }
      await this.deps.queue.deleteAsync(message);
    }
  }

  private processInboundEventAsync = async (event: IEvent): Promise<void> => {
    await this.deps.eventBus.publishAsync(event);
  }

  private synchronizeAsync = async () => {
    this.onSyncStarted();
    await this.processSendQueueAsync();
    this.onSyncFinished();
  }

  startSyncingAsync = async () => {
    if (this.running) {
      throw Error("Synchronization already running");
    }
    this.running = true;
    this.onReplicationStarted();
    this.deps.adapter.onEventReceivedAsync = this.processInboundEventAsync;
    Promise.resolve(this.deps.adapter.startReceivingEventsAsync()).then();
    while (this.running) {
      await this.synchronizeAsync();
      await this.timeout.sleepAsync(this.intervalMs);
    }
    await this.deps.adapter.stopReceivingEventsAsync();
    this.onReplicationFinished();
  }

  stopSyncing = () => {
    this.running = false;
    if (this.timeout.isRunning()) {
      this.timeout.abort();
    }
  }

  private registerHandler() {
    this.deps.eventBus.subscribeToAll(this.onEventAsync);
  }
}