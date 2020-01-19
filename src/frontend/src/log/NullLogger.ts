import { ILogger } from "./ILogger";

export class NullLogger implements ILogger {
  log(msg: string): void {
  }
  warn(msg: string): void {
  }
  error(msg: string): void {
  }
}