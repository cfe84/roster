import should from "should";
import * as td from "testdouble";
import { EventBus, IEvent } from "../src/events";
import { EventInfo } from "../src/events/EventInfo";

describe("Event bus", () => {
  it("should call subscribers for a given event type", async () => {
    // given
    const eventBus = new EventBus("");
    const event1: IEvent = { info: new EventInfo("type-1", "", "") };
    const event2: IEvent = { info: new EventInfo("type-2", "", "") };
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
    const eventBus = new EventBus("");
    const event1: IEvent = { info: new EventInfo("type-1", "", "") };
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
    const eventBus = new EventBus("");
    const event1: IEvent = { info: new EventInfo("type-1", "", "") };
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
    const eventBus = new EventBus("");
    const event1: IEvent = { info: new EventInfo("type-1", "", "") };
    const event2: IEvent = { info: new EventInfo("type-2", "", "") };
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
  });

  it("should add local emitterId if not set", async () => {
    // given
    const eventBus = new EventBus("123");
    const event1: IEvent = { info: new EventInfo("type-1", "", "") };
    const handler1: any = td.object("onEventAsync");
    eventBus.subscribe("type-1", handler1.onEventAsync);

    // when
    await eventBus.publishAsync(event1);

    // then
    td.verify(handler1.onEventAsync(td.matchers.argThat((evt: IEvent) => evt.info.emitterId === "123")));
  })

  it("should preserve remote emitterId if set", async () => {
    // given
    const eventBus = new EventBus("123");
    const event1: IEvent = { info: new EventInfo("type-1", "", "", "456") };
    const handler1: any = td.object("onEventAsync");
    eventBus.subscribe("type-1", handler1.onEventAsync);

    // when
    await eventBus.publishAsync(event1);

    // then
    td.verify(handler1.onEventAsync(td.matchers.argThat((evt: IEvent) => evt.info.emitterId === "456")));
  })


  it("should not forward external to subscribers for local events only", async () => {
    // given
    const eventBus = new EventBus("123");
    const eventExternal: IEvent = { info: new EventInfo("type-1", "", "", "456") };
    const eventLocal: IEvent = { info: new EventInfo("type-1", "", "", "123") };
    const handlerLocal: any = td.object("onEventAsync");
    eventBus.subscribeToAllLocal(handlerLocal.onEventAsync);

    // when
    await eventBus.publishAsync(eventExternal);
    await eventBus.publishAsync(eventLocal);

    // then
    td.verify(handlerLocal.onEventAsync(eventExternal), { times: 0 });
    td.verify(handlerLocal.onEventAsync(eventLocal), { times: 1 });
  })
})