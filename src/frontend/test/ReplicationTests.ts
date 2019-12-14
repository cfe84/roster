import should from "should";
import td from "testdouble";
import { ReplicationManager } from "../src/synchronization/ReplicationManager";
import { EventBus, IEvent, EventInfo } from "../lib/common/events";
import { AsyncTimeout } from "../lib/common/utils/AsyncTimeout";

describe("Replication", () => {
  const createFakes = () => ({
    adapter: td.object(["sendEventAsync", "onEventReceivedAsync", "startReceivingEventsAsync", "stopReceivingEventsAsync"]),
    queue: td.object(["pushAsync", "peekAsync", "countAsync", "deleteAsync"])
  })
  context("Replication to server", () => {
    it("should store local events to a queue", async () => {
      // given
      const localEvent1: IEvent = { info: new EventInfo("type-1", "local-client-id") };
      const localEvent2: IEvent = { info: new EventInfo("type-2", "local-client-id") };
      const remoteEvent: IEvent = { info: new EventInfo("type-2", "external-client-id") };
      const fakes = createFakes();
      const eventBus = new EventBus("local-client-id");
      new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });

      // when
      await eventBus.publishAsync(localEvent1);
      await eventBus.publishAsync(localEvent2);
      await eventBus.publishAsync(remoteEvent);

      // then
      td.verify(fakes.queue.pushAsync(localEvent1));
      td.verify(fakes.queue.pushAsync(localEvent2));
      td.verify(fakes.queue.pushAsync(remoteEvent), { times: 0, ignoreExtraArgs: true });
    });

    it("process queue for sending when starting sync", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const event2 = { info: new EventInfo("type-2"), id: 2 } as IEvent;
      const message1 = { data: event1 };
      const message2 = { data: event2 };

      const eventBus = new EventBus("");
      const fakes = createFakes();

      td.when(fakes.queue.countAsync()).thenResolve(2, 1, 0, 0);
      td.when(fakes.queue.peekAsync()).thenResolve(message1, message2, null, null);
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.intervalMs = 1000;
      const timeout = new AsyncTimeout();

      // when
      setTimeout(() => manager.stopSyncing(), 100);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);

      // then
      td.verify(fakes.adapter.sendEventAsync(event1));
      td.verify(fakes.adapter.sendEventAsync(event2));
      td.verify(fakes.queue.deleteAsync(message1));
      td.verify(fakes.queue.deleteAsync(message2));
    });

    it("should process its queue immediately when a message comes in", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const event2 = { info: new EventInfo("type-2"), id: 2 } as IEvent;
      const message1 = { data: event1 };

      const eventBus = new EventBus("");
      const fakes = createFakes();
      td.when(fakes.queue.countAsync()).thenResolve(0, 1, 0, 0);
      td.when(fakes.queue.peekAsync()).thenResolve(message1, null, null);
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.intervalMs = 1000;
      const timeout = new AsyncTimeout();

      // when
      setTimeout(() => manager.stopSyncing(), 100);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);
      // Sanity check that the test is actually verifying the message coming in and not the loop
      // going faster than we though
      td.verify(fakes.adapter.sendEventAsync(), { times: 0, ignoreExtraArgs: true });
      await eventBus.publishAsync(event2);
      await timeout.sleepAsync(10);

      // then
      td.verify(fakes.adapter.sendEventAsync(event1));
    });

    it("should retry if a message fails", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const message1 = { data: event1 };

      const eventBus = new EventBus("");
      const fakes = createFakes();
      const error = Error("sdfsg");
      const fakeCallbacks = td.object(["onError"]);
      td.when(fakes.queue.countAsync()).thenResolve(1, 1, 0, 0);
      td.when(fakes.queue.peekAsync()).thenResolve(message1, message1, null, null);
      td.when(fakes.adapter.sendEventAsync(event1)).thenReturn(Promise.reject(error), Promise.resolve());
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.onError = fakeCallbacks.onError;
      manager.intervalMs = 25;
      const timeout = new AsyncTimeout();
      // when
      setTimeout(() => manager.stopSyncing(), 200);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);
      td.verify(fakeCallbacks.onError(error), { times: 1 });
      td.verify(fakes.queue.deleteAsync(message1), { times: 0, ignoreExtraArgs: true });
      await timeout.sleepAsync(20);

      // then
      td.verify(fakes.queue.deleteAsync(message1), { times: 1, ignoreExtraArgs: true });
    });

    it("should call onSyncStarted and onSyncFinished", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const message1 = { data: event1 };

      const eventBus = new EventBus("");
      const fakes = createFakes();
      td.when(fakes.queue.countAsync()).thenResolve(1, 0, 0);
      td.when(fakes.queue.peekAsync()).thenResolve(message1, null, null);
      td.when(fakes.adapter.sendEventAsync(event1)).thenDo(async () => await new AsyncTimeout().sleepAsync(50));
      const fakeCallbacks = td.object(["onStarted", "onFinished", "onReplicationStarted", "onReplicationFinished"]);
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.onSyncStarted = fakeCallbacks.onStarted;
      manager.onSyncFinished = fakeCallbacks.onFinished;
      manager.onReplicationStarted = fakeCallbacks.onReplicationStarted;
      manager.onReplicationFinished = fakeCallbacks.onReplicationFinished;
      manager.intervalMs = 4000;
      const timeout = new AsyncTimeout();

      // when
      setTimeout(() => manager.stopSyncing(), 200);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);
      td.verify(fakeCallbacks.onReplicationStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onFinished(), { times: 0, ignoreExtraArgs: true });
      await timeout.sleepAsync(60);

      // then
      td.verify(fakeCallbacks.onStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onFinished(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onReplicationFinished(), { times: 0, ignoreExtraArgs: true });
      await timeout.sleepAsync(150);
      td.verify(fakeCallbacks.onReplicationFinished(), { times: 1, ignoreExtraArgs: true });
    });
  });

  context("Replication from server", () => {
    it("should forward events from server to the local bus", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const event2 = { info: new EventInfo("type-2"), id: 2 } as IEvent;

      const eventBus = new EventBus("");
      const fakes = createFakes();
      const fakeSubscriber = td.object(["callback1", "callback2"]);
      eventBus.subscribe("type-1", fakeSubscriber.callback1);
      eventBus.subscribe("type-2", fakeSubscriber.callback2);
      td.when(fakes.queue.countAsync()).thenReturn(0);
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.intervalMs = 10000;
      const timeout = new AsyncTimeout();

      // when
      setTimeout(() => manager.stopSyncing(), 50);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);
      await fakes.adapter.onEventReceivedAsync(event1);
      await fakes.adapter.onEventReceivedAsync(event2);

      // then
      td.verify(fakes.adapter.startReceivingEventsAsync(), { times: 1 })
      td.verify(fakes.adapter.stopReceivingEventsAsync(), { times: 0, ignoreExtraArgs: true })
      td.verify(fakeSubscriber.callback1(event1));
      td.verify(fakeSubscriber.callback2(event2));
      await timeout.sleepAsync(40);
      td.verify(fakes.adapter.stopReceivingEventsAsync())

    });
  })
});