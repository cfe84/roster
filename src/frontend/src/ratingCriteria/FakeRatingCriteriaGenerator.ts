import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { RatingCriteria } from ".";
import { RatingCriteriaCreatedEvent } from "./RatingCriteriaEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeRatingCriteriaGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const ratingCriteria: RatingCriteria = new RatingCriteria();
    ratingCriteria.details = generateContent(2 + Math.floor(Math.random() * 8));
    ratingCriteria.title = generateTitle(4 + Math.floor(Math.random() * 5));
    await eventBus.publishAsync(new RatingCriteriaCreatedEvent(ratingCriteria));
  }
}