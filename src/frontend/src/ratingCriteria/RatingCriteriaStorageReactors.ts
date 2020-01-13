import { IRatingCriteriaStore } from "./IRatingCriteriaStore";
import { IReactor } from "../storage/IReactor";
import { EventBus } from "../../lib/common/events";
import { PersonDeletedEvent } from "../persons/PersonEvent";
import { RatingCriteriaCreatedEvent, RatingCriteriaUpdatedEvent, RatingCriteriaDeletedEvent } from "./RatingCriteriaEvents";

export class RatingCriteriaStorageReactors implements IReactor {
  registerReactors(eventBus: EventBus): void {
    eventBus.subscribe(RatingCriteriaCreatedEvent.type, (evt: RatingCriteriaCreatedEvent) => this.ratingCriteriaStore.createRatingCriteriaAsync(evt.entity));
    eventBus.subscribe(RatingCriteriaUpdatedEvent.type, (evt: RatingCriteriaCreatedEvent) => this.ratingCriteriaStore.updateRatingCriteriaAsync(evt.entity));
    eventBus.subscribe(RatingCriteriaDeletedEvent.type, (evt: RatingCriteriaCreatedEvent) => this.ratingCriteriaStore.deleteRatingCriteriaAsync(evt.entity));
  }
  constructor(private ratingCriteriaStore: IRatingCriteriaStore) { }

}