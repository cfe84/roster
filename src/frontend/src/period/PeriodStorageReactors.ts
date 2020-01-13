import { IPeriodStore } from "./IPeriodStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PeriodCreatedEvent, PeriodUpdatedEvent, PeriodDeletedEvent } from "./PeriodEvents";
import { PersonDeletedEvent } from "../persons/PersonEvent";

export class PeriodStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(PeriodCreatedEvent.type, (evt: PeriodCreatedEvent) => this.periodStore.createPeriodAsync(evt.entity));
    eventBus.subscribe(PeriodUpdatedEvent.type, (evt: PeriodCreatedEvent) => this.periodStore.updatePeriodAsync(evt.entity));
    eventBus.subscribe(PeriodDeletedEvent.type, (evt: PeriodCreatedEvent) => this.periodStore.deletePeriodAsync(evt.entity));
    eventBus.subscribe(PersonDeletedEvent.type, async (evt: PersonDeletedEvent) => {
      const periods = (await this.periodStore.getPeriodsAsync()).filter((period) => period.personId === evt.person.id);
      await Promise.all(periods.map((period) => this.periodStore.deletePeriodAsync(period)));
    });
  }
  constructor(private periodStore: IPeriodStore) { }

}