import { Message } from "../lib/common/message";

export interface ISocket {
  onAsync(eventType: string, message: Message<any>): Promise<void>;
  sendAsync(eventType: string, message: Message<any>): Promise<void>;
}