import { ConnectionManager, ConnectionManagerDependencies } from "../src/ConnectionManager/ConnectionManager"
import { EventBus, IEvent } from "../lib/common/events"
import * as td from "testdouble";
import { MessageTypes, Message } from "../lib/common/message/Message";
import { EventInfo } from "../lib/common/events/EventInfo";
import { EventReceivedEvent } from "../src/ConnectionManager/EventReceivedEvent";
import { StartReceivingEventsCommand, EventReceivedAck } from "../lib/common/message";
import should from "should";

describe("Connection Manager", () => {
  it("should forward inbound event to bus and store them", async () => {
    // given
    const eventBus = new EventBus("server");
    const fakeStore = td.object(["storeEventAsync", "getEventsAsync"]);
    td.when(fakeStore.getEventsAsync(td.matchers.anything())).thenResolve([]);
    const fakeSocket = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])
    const fakeSubscriber = td.object(["onEvent"]);
    const eventType = 'sdfsd';
    eventBus.subscribe(EventReceivedEvent.type, fakeSubscriber.onEvent);
    const event: EventReceivedEvent = new EventReceivedEvent({ info: new EventInfo("1234") }, "emitter-123");
    const deps: ConnectionManagerDependencies = {
      eventBus,
      eventStore: fakeStore
    }
    const emitterId = "emitter-123";

    new ConnectionManager(deps, fakeSocket);

    // when
    const message: Message<object> = {
      emitterId,
      payload: event
    };
    const ack: EventReceivedAck = await fakeSocket.onAsync(MessageTypes.EVENT, message);

    // then
    td.verify(fakeSubscriber.onEvent(td.matchers.argThat((arg: EventReceivedEvent) =>
      arg.info.type === "EventReceivedEvent" &&
      arg.emitterId === emitterId &&
      arg.event === event)));
    td.verify(fakeStore.storeEventAsync(event));
    should(ack.dateMs).eql(event.info.date.getTime());
  });

  it("should forward received events to connected clients but not to the emitter", async () => {
    // given
    const eventBus = new EventBus("server");
    const fakeStore = td.object(["storeEventAsync", "getEventsAsync"]);
    td.when(fakeStore.getEventsAsync(td.matchers.anything())).thenResolve([]);
    const fakeSocket1 = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])
    const fakeSocket2 = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])

    const eventType = 'received-event-type';

    const deps: ConnectionManagerDependencies = {
      eventBus,
      eventStore: fakeStore
    }
    const emitterId1 = "emitter-123";
    const emitterId2 = "emitter-456";
    const event: IEvent = {
      info: new EventInfo(eventType, emitterId1)
    };
    event.info.date = new Date(2019, 10, 1);
    new ConnectionManager(deps, fakeSocket1);
    new ConnectionManager(deps, fakeSocket2);

    // when
    await fakeSocket1.onAsync(MessageTypes.COMMAND, new Message(emitterId1, new StartReceivingEventsCommand(1)));
    await fakeSocket2.onAsync(MessageTypes.COMMAND, new Message(emitterId2, new StartReceivingEventsCommand(1)));
    await eventBus.publishAsync(new EventReceivedEvent(event, emitterId1));

    // then
    td.verify(fakeSocket1.sendAsync(), { times: 0, ignoreExtraArgs: true });
    td.verify(fakeSocket2.sendAsync(MessageTypes.EVENT, td.matchers.argThat((message: Message<IEvent>) => {
      return message.emitterId === emitterId1
        && message.payload === event
    }
    )));
  });

  it("should drop subscriptions on disconnect", async () => {
    // given
    const eventBus = new EventBus("server");
    const fakeStore = td.object(["storeEventAsync", "getEventsAsync"]);
    td.when(fakeStore.getEventsAsync(td.matchers.anything())).thenResolve([]);
    const fakeSocket1 = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])
    const fakeSocket2 = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])

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
    await fakeSocket1.onAsync(MessageTypes.COMMAND, new Message(emitterId1, new StartReceivingEventsCommand(1)));
    await fakeSocket2.onAsync(MessageTypes.COMMAND, new Message(emitterId2, new StartReceivingEventsCommand(1)));
    await fakeSocket2.onDisconnectAsync();
    await eventBus.publishAsync(new EventReceivedEvent(event, emitterId1));

    // then
    td.verify(fakeSocket1.sendAsync(), { times: 0, ignoreExtraArgs: true });
    td.verify(fakeSocket2.sendAsync(), { times: 0, ignoreExtraArgs: true });
  });

  const makeEvent = () => ({
    info: new EventInfo("does not matter", "does not matter")
  })

  it("should send event history on starting reception", async () => {
    // given
    const eventBus = new EventBus("server");
    const fakeStore = td.object(["storeEventAsync", "getEventsAsync"]);
    const fakeSocket1 = td.object(["onAsync", "sendAsync", "onDisconnectAsync"])
    const events = [makeEvent(), makeEvent(), makeEvent()];
    td.when(fakeStore.getEventsAsync(2000)).thenReturn(events);

    const deps: ConnectionManagerDependencies = {
      eventBus,
      eventStore: fakeStore
    }
    new ConnectionManager(deps, fakeSocket1);

    // when
    await fakeSocket1.onAsync(MessageTypes.COMMAND, new Message("12345", new StartReceivingEventsCommand(2000)));

    // then
    events.forEach((event) => {
      td.verify(fakeSocket1.sendAsync(MessageTypes.EVENT, td.matchers.argThat((msg: Message<IEvent>) => msg.payload === event)));
    })
  })
})