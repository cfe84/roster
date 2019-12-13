import { IReplicationAdapter } from "../synchronization/IReplicationAdapter";
import { IEvent } from "../../lib/common/events";
import io from "socket.io-client";
import { Message, MessageTypes, StartReceivingEventsCommand } from "../../lib/common/message/";

export class SocketReplicationAdapter implements IReplicationAdapter {
  socket: SocketIOClient.Socket;

  constructor(backendUrl: string, private clientId: string) {
    this.socket = io(backendUrl);
    this.socket.on(MessageTypes.EVENT,
      (message: Message<IEvent>) => this.onEventReceivedAsync(message.payload));
  }

  sendEventAsync = (event: IEvent): Promise<void> => new Promise((resolve, reject) => {
    const message = new Message(this.clientId, event);
    this.socket.emit(MessageTypes.EVENT, message);
    resolve();
  });

  startReceivingEventsAsync = (): Promise<void> => new Promise((resolve, reject) => {
    const command = new StartReceivingEventsCommand();
    const message = new Message(this.clientId, command);
    this.socket.emit(MessageTypes.COMMAND, message);
    resolve();
  });

  stopReceivingEventsAsync(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  onEventReceivedAsync = async (event: IEvent): Promise<void> => { }
}