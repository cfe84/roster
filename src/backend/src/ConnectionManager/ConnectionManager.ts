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

export interface ConnectionInformation {
  clientId: string,
  accountId: string,
  lastReceivedDateMs: number
}

export class ConnectionManager {
  private forwardEventSubscription?: SubscriptionRecord<EventReceivedEvent>;
  private receivingEvents = false;
  private clientId: string;

  constructor(private deps: ConnectionManagerDependencies, private socket: ISocket, private connectionInfo: ConnectionInformation, private debug = false) {
    this.socket.onAsync = this.onAsync;
    this.socket.onDisconnectAsync = this.onDisconnectAsync;
    this.clientId = connectionInfo.clientId;
  }

  async startAsync(): Promise<void> {
    await this.startReceivingEventsAsync(this.connectionInfo.lastReceivedDateMs);
  }

  log(message: any) {
    if (this.debug) {
      console.log(message);
    }
  }

  private onAsync = async (messageType: string, message: Message<any>): Promise<any> => {
    this.log(`Received message of type ${messageType}`)
    switch (messageType) {
      case MessageTypes.EVENT:
        return await this.processInboundEventAsync(message);
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

  private startReceivingEventsAsync = async (lastReceivedDateMs: number) => {
    if (this.receivingEvents) {
      throw Error("Already receiving events");
    }
    this.log(`Starting event reception for client ${this.clientId}`)
    this.receivingEvents = true;
    const eventsToForward = await this.deps.eventStore.getEventsAsync(lastReceivedDateMs);
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
}