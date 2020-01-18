import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { Person } from "../persons";
import { EvaluationCriteria } from ".";
import { EvaluationCriteriaCreatedEvent } from "./EvaluationCriteriaEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";
import { Rate } from "./EvaluationCriteria";

export class FakeEvaluationCriteriaGenerator implements IFakeGenerator {
  constructor() { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const evaluationCriteria: EvaluationCriteria = new EvaluationCriteria();
    evaluationCriteria.details = generateContent(2 + Math.floor(Math.random() * 8));
    evaluationCriteria.title = generateTitle(4 + Math.floor(Math.random() * 5));
    const ratesCount = Math.random() * 5 + 2;
    const rates: Rate[] = [];
    for (let i = 0; i < ratesCount; i++) {
      rates.push({
        description: generateContent(1 + Math.floor(Math.random() * 3)),
        name: generateTitle(1 + Math.floor(Math.random() * 3)),
        rate: i
      })
    }
    evaluationCriteria.rates = rates;
    await eventBus.publishAsync(new EvaluationCriteriaCreatedEvent(evaluationCriteria));
  }
}