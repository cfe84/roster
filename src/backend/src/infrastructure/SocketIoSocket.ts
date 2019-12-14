import { ISocket } from "../ISocket";
import { Message, MessageTypes } from "../../lib/common/message";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer"

export class SocketIoSocket implements ISocket {
  constructor(private socket: SocketIO.Socket) {
    socket.on(MessageTypes.COMMAND, (message) => this.onAsync(MessageTypes.COMMAND, JsonSerializer.clean(message)));
    socket.on(MessageTypes.EVENT, (message, callback) => this.onAsync(MessageTypes.EVENT, JsonSerializer.clean(message)).then((res) => callback(res)));
    socket.on(MessageTypes.HANDSHAKE, (message) => this.onAsync(MessageTypes.HANDSHAKE, JsonSerializer.clean(message)));
    socket.on("disconnect", () => console.log("Disconnected"));
  }
  onAsync(eventType: string, message: Message<any>): Promise<any> {
    throw new Error("EventHandler not set.");
  }
  async onDisconnectAsync(): Promise<void> {
  }

  async sendAsync(eventType: string, message: Message<any>): Promise<void> {
    this.socket.emit(eventType, message);
  }
}