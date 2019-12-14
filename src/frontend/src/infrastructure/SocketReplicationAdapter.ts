import { IReplicationAdapter } from "../synchronization/IReplicationAdapter";
import { IEvent } from "../../lib/common/events";
import io from "socket.io-client";
import { Message, MessageTypes, StartReceivingEventsCommand, EventReceivedAck } from "../../lib/common/message/";
import { ILocalStorage } from "./LocalStorageQueue";

const LAST_RECEIVED_DATE_KEY = "sync.lastReceivedDate";

export class SocketReplicationAdapter implements IReplicationAdapter {
  socket: SocketIOClient.Socket;

  constructor(backendUrl: string, private clientId: string, private storage: ILocalStorage = localStorage) {
    this.socket = io(backendUrl);
    this.socket.on(MessageTypes.EVENT,
      (message: Message<IEvent>) => {
        console.log(message);
        this.onEventReceivedAsync(message.payload)
      });
  }

  private getLastReceivedDate = (): number => {
    const lrd = this.storage.getItem(LAST_RECEIVED_DATE_KEY);
    if (lrd === null) {
      return 0;
    } else {
      return parseInt(lrd);
    }
  }
  private setLastReceivedDate = (lastReceivedDateMs: number): void =>
    this.storage.setItem(LAST_RECEIVED_DATE_KEY, lastReceivedDateMs.toString());

  sendEventAsync = (event: IEvent): Promise<void> => new Promise((resolve, reject) => {
    const message = new Message(this.clientId, event);
    console.log(`Sending to socket: ${JSON.stringify(message)}`);
    const timeout = setTimeout(() => reject(Error("Timeout forwarding event")), 15000);
    this.socket.emit(MessageTypes.EVENT, message, (response: EventReceivedAck) => {
      console.log(`Received ACK for event: ${response.dateMs}`)
      clearTimeout(timeout);
      this.setLastReceivedDate(response.dateMs)
      resolve();
    });
  });

  startReceivingEventsAsync = (): Promise<void> => new Promise((resolve, reject) => {
    const lastReceivedDate = this.getLastReceivedDate();
    console.log(`Synchronizing events from ${lastReceivedDate}`)
    const command = new StartReceivingEventsCommand(lastReceivedDate);
    const message = new Message(this.clientId, command);
    this.socket.emit(MessageTypes.COMMAND, message);
    resolve();
  });

  stopReceivingEventsAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  onEventReceivedAsync = async (event: IEvent): Promise<void> => {
    console.error("Received an event on the fake receiver")
  }
}