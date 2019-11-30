import { UIElement, Document } from "../src/html/UIElement";
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
  })
})