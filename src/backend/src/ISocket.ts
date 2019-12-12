import { Message } from "./Message";

export interface ISocket {
  onAsync(eventType: string, message: Message): Promise<void>;
  sendAsync(eventType: string, message: Message): Promise<void>;
}