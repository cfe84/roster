import { Message } from "../lib/common/message";

export interface ISocket {
  onAsync(eventType: string, message: Message<any>): Promise<any>;
  sendAsync(eventType: string, message: Message<any>): Promise<void>;
  onDisconnectAsync(): Promise<void>;
}