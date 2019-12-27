import { ILogger } from "../log/ILogger";

export class ConsoleLogger implements ILogger {
  log(msg: string): void {
    console.log(msg);
  }
  warn(msg: string): void {
    console.warn(msg);
  }
  error(msg: string): void {
    console.error(msg);
  }
}