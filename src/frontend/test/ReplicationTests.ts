import should from "should";
import td from "testdouble";
import { ReplicationManager } from "../src/synchronization/ReplicationManager";
import { EventBus, IEvent } from "../src/events";
import { EventInfo } from "../src/events/EventInfo";
import { AsyncTimeout } from "../src/utils/AsyncTimeout";

describe("Replication", () => {
  context("Replication to server", () => {
    const createFakes = () => ({
      adapter: td.object(["sendEventAsync", "receiveEventsAsync"]),
      queue: td.object(["pushAsync", "peekAsync", "countAsync", "deleteAsync"])
    })
    it("should replicate all events", async () => {
      // given
      const event1: IEvent = { info: new EventInfo("type-1") };
      const event2: IEvent = { info: new EventInfo("type-2") };
      const fakes = createFakes();
      const eventBus = new EventBus();
      new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });

      // when
      await eventBus.publishAsync(event1);
      await eventBus.publishAsync(event2);

      // then
      td.verify(fakes.queue.pushAsync(event1));
      td.verify(fakes.queue.pushAsync(event2));
    });

    context("process queue for sending when starting sync", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const event2 = { info: new EventInfo("type-2"), id: 2 } as IEvent;
      const message1 = { data: event1 };
      const message2 = { data: event2 };

      const eventBus = new EventBus();
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
      it("should send events to the adapter", () => {
        td.verify(fakes.adapter.sendEventAsync(event1));
        td.verify(fakes.adapter.sendEventAsync(event2));
      });
      it("should delete messages from local queue", () => {
        td.verify(fakes.queue.deleteAsync(message1));
        td.verify(fakes.queue.deleteAsync(message2));
      });
    });

    it("should process its queue immediately when a message comes in", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const event2 = { info: new EventInfo("type-2"), id: 2 } as IEvent;
      const message1 = { data: event1 };

      const eventBus = new EventBus();
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

    it("should call onSyncStarted and onSyncFinished", async () => {
      // given
      const event1 = { info: new EventInfo("type-1"), id: 1 } as IEvent;
      const message1 = { data: event1 };

      const eventBus = new EventBus();
      const fakes = createFakes();
      td.when(fakes.queue.countAsync()).thenResolve(1, 0, 0);
      td.when(fakes.queue.peekAsync()).thenResolve(message1, null, null);
      td.when(fakes.adapter.sendEventAsync(event1)).thenDo(async () => await new AsyncTimeout().sleepAsync(100));
      const fakeCallbacks = td.object(["onStarted", "onFinished", "onReplicationStarted", "onReplicationFinished"]);
      const manager = new ReplicationManager({ eventBus, adapter: fakes.adapter, queue: fakes.queue });
      manager.onSyncStarted = fakeCallbacks.onStarted;
      manager.onSyncFinished = fakeCallbacks.onFinished;
      manager.onReplicationStarted = fakeCallbacks.onReplicationStarted;
      manager.onReplicationFinished = fakeCallbacks.onReplicationFinished;
      manager.intervalMs = 4000;
      const timeout = new AsyncTimeout();

      // when
      setTimeout(() => manager.stopSyncing(), 300);
      manager.startSyncingAsync().then();
      await timeout.sleepAsync(10);
      td.verify(fakeCallbacks.onReplicationStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onFinished(), { times: 0, ignoreExtraArgs: true });
      await timeout.sleepAsync(110);

      // then
      td.verify(fakeCallbacks.onStarted(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onFinished(), { times: 1, ignoreExtraArgs: true });
      td.verify(fakeCallbacks.onReplicationFinished(), { times: 0, ignoreExtraArgs: true });
      await timeout.sleepAsync(200);
      td.verify(fakeCallbacks.onReplicationFinished(), { times: 1, ignoreExtraArgs: true });
    });
  });
});