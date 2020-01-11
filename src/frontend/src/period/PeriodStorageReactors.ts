import { IPeriodStore } from "./IPeriodStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PeriodCreatedEvent, PeriodUpdatedEvent, PeriodDeletedEvent } from "./PeriodEvents";

export class PeriodStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(PeriodCreatedEvent.type, (evt: PeriodCreatedEvent) => this.actionStore.createPeriodAsync(evt.entity));
    eventBus.subscribe(PeriodUpdatedEvent.type, (evt: PeriodCreatedEvent) => this.actionStore.updatePeriodAsync(evt.entity));
    eventBus.subscribe(PeriodDeletedEvent.type, (evt: PeriodCreatedEvent) => this.actionStore.deletePeriodAsync(evt.entity));
  }
  constructor(private actionStore: IPeriodStore) { }

}