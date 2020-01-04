import { EventInfo } from "./EventInfo";

export interface IEvent {
  info: EventInfo;
}

export interface ITypedEvent<T> extends IEvent {
  info: EventInfo;
  entity: T;
}

export interface IEventFactory<T> {
  createCreatedEvent(entity: T): ITypedEvent<T>;
  createUpdatedEvent(entity: T): ITypedEvent<T>;
  createDeletedEvent(entity: T): ITypedEvent<T>;
  createdEventType: string;
  updatedEventType: string;
  deletedEventType: string;
}