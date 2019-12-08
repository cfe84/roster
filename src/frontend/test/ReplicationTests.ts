import should from "should";
import td from "testdouble";
import { ReplicationManager } from "../src/synchronization/ReplicationManager";
import { EventBus, IEvent } from "../src/events";
import { EventInfo } from "../src/events/EventInfo";

describe("Replication", () => {
  context("Replication to server", () => {
    it("should replicate all events", async () => {
      // given
      const event1: IEvent = { info: new EventInfo("type-1") };
      const event2: IEvent = { info: new EventInfo("type-2") };

      const eventBus = new EventBus();
      const fakeAdapter = td.object(["replicateEventAsync"]);
      new ReplicationManager(eventBus, fakeAdapter);

      // when
      await eventBus.publishAsync(event1);
      await eventBus.publishAsync(event2);

      // then
      td.verify(fakeAdapter.replicateEventAsync(event1));
      td.verify(fakeAdapter.replicateEventAsync(event2));
    });
    it("should retry later if replication failed")
  });
});