import { IEventStore } from "../Storage/IEventStore";
import { ISocket } from "../ISocket";
import { Message, ClientId, MessageTypes } from "../../lib/common/message/Message";
import { EventBus, IEvent } from "../../lib/common/events";
import { EventReceivedEvent } from "./EventReceivedEvent";
import { ICommand } from "../../lib/common/message/ICommand";
import { StartReceivingEventsCommand } from "../../lib/common/message/StartReceivingEventsCommand";
import { SubscriptionRecord } from "../../lib/common/events/SubscriptionRecord";

export interface ConnectionManagerDependencies {
  eventStore: IEventStore;
  eventBus: EventBus
}

export class ConnectionManager {
  private clientId?: ClientId;
  private receiveEventSubscription?: SubscriptionRecord<EventReceivedEvent>;
  private receivingEvents = false;

  constructor(private deps: ConnectionManagerDependencies, private socket: ISocket) {
    this.socket.onAsync = this.onAsync;
  }

  private onAsync = async (messageType: string, message: Message<any>): Promise<void> => {
    switch (messageType) {
      case MessageTypes.HANDSHAKE:
        await this.processHandshakeAsync(message);
        break;
      case MessageTypes.EVENT:
        await this.processInboundEventAsync(message);
        break;
      case MessageTypes.COMMAND:
        await this.processCommandAsync(message);
        break;
      default:
        throw (Error(`Unknown type: ${messageType}`));
    }
  }

  private processCommandAsync = async (message: Message<ICommand>): Promise<void> => {
    const command = message.payload;
    switch (command.command) {
      case StartReceivingEventsCommand.command:
        this.startReceivingEvents(message);
        break;
      default:
        throw Error(`Unknown command: ${command.command}`);
    }
  }

  private startReceivingEvents = (message: Message<ICommand>) => {
    if (this.receivingEvents) {
      throw Error("Already receiving events");
    }
    this.clientId = message.emitterId;
    this.receivingEvents = true;
    this.receiveEventSubscription = this.deps.eventBus.subscribe(EventReceivedEvent.type, async (event: EventReceivedEvent) => {
      if (this.clientId !== event.emitterId) {
        await this.forwardEventAsync(event)
      }
    });
  }

  private forwardEventAsync = async (event: EventReceivedEvent): Promise<void> => {
    const message = new Message(event.emitterId, event.event);
    await this.socket.sendAsync(MessageTypes.EVENT, message);
  }

  private async processInboundEventAsync(message: Message<IEvent>): Promise<void> {
    await this.deps.eventBus.publishAsync(new EventReceivedEvent(message.payload, message.emitterId));
  }

  private async processHandshakeAsync(message: Message<any>): Promise<void> {
    this.clientId = message.emitterId;
  }
}