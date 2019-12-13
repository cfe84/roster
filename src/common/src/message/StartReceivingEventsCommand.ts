import { ICommand } from "./ICommand";

export class StartReceivingEventsCommand implements ICommand {
  static command = "StartReceivingEvents";
  command: string = StartReceivingEventsCommand.command;
}