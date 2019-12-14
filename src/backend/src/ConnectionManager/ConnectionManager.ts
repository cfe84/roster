import { IEventStore } from "../Storage/IEventStore";
import { ISocket } from "../ISocket";
import { Message, ClientId, MessageTypes } from "../../lib/common/message/Message";
import { EventBus, IEvent } from "../../lib/common/events";
import { EventReceivedEvent } from "./EventReceivedEvent";
import { ICommand, StartReceivingEventsCommand, EventReceivedAck } from "../../lib/common/message";
import { SubscriptionRecord } from "../../lib/common/events/SubscriptionRecord";

export interface ConnectionManagerDependencies {
  eventStore: IEventStore;
  eventBus: EventBus
}

export class ConnectionManager {
  private clientId?: ClientId;
  private forwardEventSubscription?: SubscriptionRecord<EventReceivedEvent>;
  private receivingEvents = false;

  constructor(private deps: ConnectionManagerDependencies, private socket: ISocket, private debug = false) {
    this.socket.onAsync = this.onAsync;
    this.socket.onDisconnectAsync = this.onDisconnectAsync;
  }

  log(message: any) {
    if (this.debug) {
      console.log(message);
    }
  }

  private onAsync = async (messageType: string, message: Message<any>): Promise<any> => {
    this.log(`Received message of type ${messageType}`)
    switch (messageType) {
      case MessageTypes.HANDSHAKE:
        await this.processHandshakeAsync(message);
        break;
      case MessageTypes.EVENT:
        return await this.processInboundEventAsync(message);
      case MessageTypes.COMMAND:
        await this.processCommandAsync(message);
        break;
      default:
        throw (Error(`Unknown type: ${messageType}`));
    }
  }

  private onDisconnectAsync = async (): Promise<void> => {
    if (this.forwardEventSubscription) {
      this.forwardEventSubscription.unsubscribe();
    }
    this.log(`Client ${this.clientId} disconnected`)
  }

  private processCommandAsync = async (message: Message<ICommand>): Promise<void> => {
    const command = message.payload;
    switch (command.command) {
      case StartReceivingEventsCommand.command:
        await this.startReceivingEventsAsync(message as Message<StartReceivingEventsCommand>);
        break;
      default:
        throw Error(`Unknown command: ${command.command}`);
    }
  }

  private startReceivingEventsAsync = async (message: Message<StartReceivingEventsCommand>) => {
    if (this.receivingEvents) {
      throw Error("Already receiving events");
    }
    this.clientId = message.emitterId;
    this.log(`Starting event reception for client ${this.clientId}`)
    this.receivingEvents = true;
    const eventsToForward = await this.deps.eventStore.getEventsAsync(message.payload.lastReceivedDateMs);
    this.log(`Found ${eventsToForward.length} events to forward`);
    for (let i = 0; i < eventsToForward.length; i++) {
      await this.forwardEventAsync(eventsToForward[i]);
    }
    this.forwardEventSubscription = this.deps.eventBus.subscribe(EventReceivedEvent.type, async (event: EventReceivedEvent) => {
      if (this.clientId !== event.emitterId) {
        await this.forwardEventAsync(event.event)
      }
    });
  }

  private forwardEventAsync = async (event: IEvent): Promise<void> => {
    const message = new Message(event.info.emitterId || "", event);
    this.log(`Forwarding event ${JSON.stringify(event)} to client ${this.clientId}`)
    await this.socket.sendAsync(MessageTypes.EVENT, message);
  }

  private async processInboundEventAsync(message: Message<IEvent>): Promise<EventReceivedAck> {
    this.log(`Received event from ${this.clientId}: ${JSON.stringify(message)}`);
    await this.deps.eventStore.storeEventAsync(message.payload);
    await this.deps.eventBus.publishAsync(new EventReceivedEvent(message.payload, message.emitterId));
    return {
      dateMs: message.payload.info.date.getTime()
    };
  }

  private async processHandshakeAsync(message: Message<any>): Promise<void> {
    this.clientId = message.emitterId;
  }
}