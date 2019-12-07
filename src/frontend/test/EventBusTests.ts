import should from "should";
import * as td from "testdouble";
import { EventBus, IEvent } from "../src/events";

describe("Event bus", () => {
  it("should call subscribers for a given event type", async () => {
    // given
    const eventBus = new EventBus();
    const event1: IEvent = { type: "type-1" };
    const event2: IEvent = { type: "type-2" };
    const handlerType1: any = td.object("onEventAsync");
    eventBus.subscribe("type-1", handlerType1.onEventAsync);
    td.when(handlerType1.onEventAsync(event2)).thenThrow(Error("Should not happen"));

    // when
    await eventBus.publishAsync(event1);
    await eventBus.publishAsync(event2);

    // then
    td.verify(handlerType1.onEventAsync(event1));
  });

  it("should unsubscribe", async () => {
    // given
    const eventBus = new EventBus();
    const event1: IEvent = { type: "type-1" };
    const handler1: any = td.object("onEventAsync");
    const handler2: any = td.object("onEventAsync");
    const handler3: any = td.object("onEventAsync");
    const record1 = eventBus.subscribe("type-1", handler1.onEventAsync);
    const record3 = eventBus.subscribe("type-1", handler3.onEventAsync);
    eventBus.subscribe("type-1", handler2.onEventAsync);
    td.when(handler1.onEventAsync(event1)).thenThrow(Error("Should not happen"));
    td.when(handler3.onEventAsync(event1)).thenThrow(Error("Should not happen"));

    // when
    eventBus.unsubscribe(record1);
    record3.unsubscribe();
    await eventBus.publishAsync(event1);

    // then
    td.verify(handler2.onEventAsync(event1));
  });

  it("should callback synchronously or asynchronously", async () => {
    // given
    const eventBus = new EventBus();
    const event1: IEvent = { type: "type-1" };
    let called1 = false, called2 = false;
    const syncHandler = (evt: IEvent) => { called1 = true };
    const asyncHandler = async (evt: IEvent) => { called2 = true };
    eventBus.subscribe("type-1", syncHandler);
    eventBus.subscribe("type-1", asyncHandler);

    // when
    await eventBus.publishAsync(event1);

    // then
    should(called1).be.true();
    should(called2).be.true();
  });

  it("should callback catch-alls for all events", async () => {
    // given
    const eventBus = new EventBus();
    const event1: IEvent = { type: "type-1" };
    const event2: IEvent = { type: "type-2" };
    const handler1: any = td.object("onEventAsync");
    const handler2: any = td.object("onEventAsync");
    td.when(handler1.onEventAsync(event2)).thenThrow(Error("Should not happen"));

    // when
    eventBus.subscribeToAll(handler2.onEventAsync);
    eventBus.subscribe("type-1", handler1.onEventAsync);
    await eventBus.publishAsync(event1);
    await eventBus.publishAsync(event2);

    // then
    td.verify(handler1.onEventAsync(event1));
    td.verify(handler2.onEventAsync(event1));
    td.verify(handler2.onEventAsync(event2));
  })
})