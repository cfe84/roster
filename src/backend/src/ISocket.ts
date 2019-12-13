import { Message } from "./ConnectionManager/Message";

export interface ISocket {
  onAsync(eventType: string, message: Message<any>): Promise<void>;
  sendAsync(eventType: string, message: Message<any>): Promise<void>;
}