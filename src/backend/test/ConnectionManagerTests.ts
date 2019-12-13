import { ConnectionManager, ConnectionManagerDependencies } from "../src/ConnectionManager/ConnectionManager"
import { EventBus, IEvent } from "../lib/common/events"
import * as td from "testdouble";
import { MessageTypes, Message } from "../lib/common/message/Message";
import { EventInfo } from "../lib/common/events/EventInfo";
import { EventReceivedEvent } from "../src/ConnectionManager/EventReceivedEvent";
import { StartReceivingEventsCommand } from "../lib/common/message/StartReceivingEventsCommand";

describe("Connection Manager", () => {
  it("should forward inbound event to bus", async () => {
    // given
    const eventBus = new EventBus();
    const fakeStore = td.object(["storeEventAsync"]);
    const fakeSocket = td.object(["onAsync", "sendAsync"])
    const fakeSubscriber = td.object(["onEvent"]);
    const eventType = 'sdfsd';
    eventBus.subscribe(EventReceivedEvent.type, fakeSubscriber.onEvent);
    const event: IEvent = {
      info: new EventInfo(eventType)
    };
    const deps: ConnectionManagerDependencies = {
      eventBus,
      eventStore: fakeStore
    }
    const emitterId = "emitter-123";

    const manager = new ConnectionManager(deps, fakeSocket);

    // when
    const message: Message<object> = {
      emitterId,
      payload: event
    };
    await fakeSocket.onAsync(MessageTypes.EVENT, message);

    // then
    td.verify(fakeSubscriber.onEvent(td.matchers.argThat((arg: EventReceivedEvent) =>
      arg.info.type === "EventReceivedEvent" &&
      arg.emitterId === emitterId &&
      arg.event === event)));
  });

  it("should forward received events to connected clients but not to the emitter", async () => {
    // given
    const eventBus = new EventBus();
    const fakeStore = td.object(["storeEventAsync"]);
    const fakeSocket1 = td.object(["onAsync", "sendAsync"])
    const fakeSocket2 = td.object(["onAsync", "sendAsync"])

    const eventType = 'received-event-type';
    const event: IEvent = {
      info: new EventInfo(eventType)
    };
    const deps: ConnectionManagerDependencies = {
      eventBus,
      eventStore: fakeStore
    }
    const emitterId1 = "emitter-123";
    const emitterId2 = "emitter-456";
    new ConnectionManager(deps, fakeSocket1);
    new ConnectionManager(deps, fakeSocket2);

    // when
    await fakeSocket1.onAsync(MessageTypes.COMMAND, new Message(emitterId1, new StartReceivingEventsCommand()));
    await fakeSocket2.onAsync(MessageTypes.COMMAND, new Message(emitterId2, new StartReceivingEventsCommand()));
    await eventBus.publishAsync(new EventReceivedEvent(event, emitterId1));

    // then
    td.verify(fakeSocket1.sendAsync(), { times: 0, ignoreExtraArgs: true });
    td.verify(fakeSocket2.sendAsync(MessageTypes.EVENT, td.matchers.argThat((message: Message<IEvent>) =>
      message.emitterId === emitterId1
      && message.payload === event
    )));
  });
})