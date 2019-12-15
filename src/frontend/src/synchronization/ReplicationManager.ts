import { EventBus, IEvent } from "../../lib/common/events/";
import { IReplicationAdapter } from "./IReplicationAdapter";
import { IQueue, IQueueMessage } from "./IQueue";
import { AsyncTimeout } from "../../lib/common/utils/AsyncTimeout";

export interface ReplicationManagerDependencies {
  eventBus: EventBus;
  adapter: IReplicationAdapter;
  queue: IQueue<IEvent>;
}

export class ReplicationManager {
  private timeout = new AsyncTimeout();
  private running = false;
  public intervalMs: number = 10000;

  private log(text: string) {
    if (this.debug) {
      console.log(text);
    }
  }

  constructor(private deps: ReplicationManagerDependencies, private debug: boolean = false) {
    this.registerHandler();
  }

  onSyncStarted = () => { }
  onSyncFinished = () => { }
  onReplicationStarted = () => { }
  onReplicationFinished = () => { }
  onError = (error: Error) => { }

  onEventAsync = async (event: IEvent) => {
    this.log(`Queued event for forwarding: ${event}`);
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
      const message: IQueueMessage<IEvent> = await this.deps.queue.peekAsync();
      try {
        this.log(`Sending event : ${JSON.stringify(message)}`);
        await this.deps.adapter.sendEventAsync(message.data);
      } catch (error) {
        this.onError(error);
        return;
      }
      await this.deps.queue.deleteAsync(message);
    }
  }

  private processInboundEventAsync = async (event: IEvent): Promise<void> => {
    this.log(`Received event from server: ${JSON.stringify(event)}`)
    await this.deps.eventBus.publishAsync(event);
  }

  private synchronizationRetryLoopAsync = async () => {
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
    await this.deps.adapter.connectAsync()
    while (this.running) {
      await this.synchronizationRetryLoopAsync();
      await this.timeout.sleepAsync(this.intervalMs);
    }
    this.onReplicationFinished();
  }

  stopSyncing = () => {
    this.running = false;
    if (this.timeout.isRunning()) {
      this.timeout.abort();
    }
  }

  private registerHandler() {
    this.deps.eventBus.subscribeToAllLocal(this.onEventAsync);
  }
}