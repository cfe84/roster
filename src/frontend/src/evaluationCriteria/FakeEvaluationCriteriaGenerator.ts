import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { EvaluationCriteria } from ".";
import { EvaluationCriteriaCreatedEvent } from "./EvaluationCriteriaEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";

export class FakeEvaluationCriteriaGenerator implements IFakeGenerator {
  constructor(private person: Person) { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const evaluationCriteria: EvaluationCriteria = new EvaluationCriteria();
    evaluationCriteria.details = generateContent(2 + Math.floor(Math.random() * 8));
    evaluationCriteria.title = generateTitle(4 + Math.floor(Math.random() * 5));
    await eventBus.publishAsync(new EvaluationCriteriaCreatedEvent(evaluationCriteria));
  }
}