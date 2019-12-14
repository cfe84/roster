import { ISocket } from "../ISocket";
import { Message, MessageTypes } from "../../lib/common/message";

export class SocketIoSocket implements ISocket {
  constructor(private socket: SocketIO.Socket) {
    socket.on(MessageTypes.COMMAND, (message) => this.onAsync(MessageTypes.COMMAND, message));
    socket.on(MessageTypes.EVENT, (message) => this.onAsync(MessageTypes.EVENT, message));
    socket.on(MessageTypes.HANDSHAKE, (message) => this.onAsync(MessageTypes.HANDSHAKE, message));
    socket.on("disconnect", () => console.log("Disconnected"));
  }
  onAsync(eventType: string, message: Message<any>): Promise<void> {
    throw new Error("EventHandler not set.");
  }
  async onDisconnectAsync(): Promise<void> {
  }

  async sendAsync(eventType: string, message: Message<any>): Promise<void> {
    this.socket.emit(eventType, message);
  }
}