import { EventBus } from "../lib/common/events";
import * as td from "testdouble";
import { EvaluationDeletedEvent, EvaluationCreatedEvent, EvaluationUpdatedEvent } from "../src/evaluation/EvaluationEvents";
import { EvaluationStorageReactors } from "../src/evaluation/EvaluationStorageReactors";
import { IEvaluationStore, Evaluation } from "../src/evaluation";
import { Period } from "../src/period";
import { PeriodDeletedEvent } from "../src/period/PeriodEvents";
import { EvaluationCriteria } from "../src/evaluationCriteria";
import { EvaluationCriteriaDeletedEvent, EvaluationCriteriaUpdatedEvent } from "../src/evaluationCriteria/EvaluationCriteriaEvents";

describe("Evaluation domain", () => {
  const createStore = (storeName: string) => td.object([`get${storeName}sAsync`, `create${storeName}Async`, `update${storeName}Async`, `delete${storeName}Async`])

  it("should create evaluations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluation = new Evaluation("123", "456", "sdlgkdf");
    const event = new EvaluationCreatedEvent(evaluation);

    const fakeEvaluationStore = createStore("Evaluation") as IEvaluationStore;
    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeEvaluationStore.createEvaluationAsync(evaluation));
  })

  it("should update evaluations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluation = new Evaluation("123", "456", "sdlgkdf");
    const event = new EvaluationUpdatedEvent(evaluation);

    const fakeEvaluationStore = createStore("Evaluation") as IEvaluationStore;
    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeEvaluationStore.updateEvaluationAsync(evaluation));
  })

  it("should delete evaluations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluation = new Evaluation("123", "134542", "2344");
    const event = new EvaluationDeletedEvent(evaluation);

    const fakeEvaluationStore = createStore("Evaluation") as IEvaluationStore;
    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeEvaluationStore.deleteEvaluationAsync(evaluation));
  })

  it("should delete all evaluations of a deleted period", async () => {
    // given
    const eventBus = new EventBus("", false);
    const period: Period = new Period("1423");

    const fakeEvaluationStore = createStore("Evaluation");
    const correspondingEvaluation1 = new Evaluation(period.id, "123", "fdg");
    const notCorrespondingEvaluation = new Evaluation("fddgh", "2353", "sdfgd");
    const correspondingEvaluation2 = new Evaluation(period.id, "sdfg", "svd");
    const fakeEvaluations = [correspondingEvaluation1, notCorrespondingEvaluation, correspondingEvaluation2]
    td.when(fakeEvaluationStore.getEvaluationsAsync()).thenResolve(fakeEvaluations);

    const fakeSubscriber = td.object(["evaluations"]);
    eventBus.subscribe(EvaluationDeletedEvent.type, fakeSubscriber.evaluations);

    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new PeriodDeletedEvent(period));

    // then
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === correspondingEvaluation1)))
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === correspondingEvaluation2)))
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === notCorrespondingEvaluation)), { times: 0 })
  })

  it("should delete all evaluations of a deleted evaluation criteria", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluationCriteria = new EvaluationCriteria();

    const fakeEvaluationStore = createStore("Evaluation");
    const correspondingEvaluation1 = new Evaluation("sdfgd", evaluationCriteria.id, "fdg");
    const correspondingEvaluation2 = new Evaluation("sdggfd", evaluationCriteria.id, "svd");
    const notCorrespondingEvaluation = new Evaluation("fddgh", "2353", "sdfgd");
    const fakeEvaluations = [correspondingEvaluation1, notCorrespondingEvaluation, correspondingEvaluation2]
    td.when(fakeEvaluationStore.getEvaluationsAsync()).thenResolve(fakeEvaluations);

    const fakeSubscriber = td.object(["evaluations"]);
    eventBus.subscribe(EvaluationDeletedEvent.type, fakeSubscriber.evaluations);

    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new EvaluationCriteriaDeletedEvent(evaluationCriteria));

    // then
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === correspondingEvaluation1)))
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === correspondingEvaluation2)))
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationDeletedEvent) => arg.entity === notCorrespondingEvaluation)), { times: 0 })
  });

  it("should update criteria name and rate name for updated evaluation criteria", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluationCriteria = new EvaluationCriteria();
    evaluationCriteria.rates.push({ id: "a", name: "name-A", description: "dsfs", order: 0 })
    evaluationCriteria.rates.push({ id: "b", name: "name-B", description: "dsfs", order: 0 })
    const newName = "sfsdfsdfgdg";
    const newRateName = "sdfmskfgmd"

    const fakeEvaluationStore = createStore("Evaluation");
    const correspondingEvaluation1 = new Evaluation("sdfgd", evaluationCriteria.id, "fdg");
    correspondingEvaluation1.rateId = "a";
    const correspondingEvaluation2 = new Evaluation("sdggfd", evaluationCriteria.id, "svd");
    correspondingEvaluation2.rateId = "b";
    const notCorrespondingEvaluation1 = new Evaluation("fddgh", "2353", "sdfgd");
    const alreadyCorrectEvaluation = new Evaluation("fddgh", evaluationCriteria.id, newName);
    const fakeEvaluations = [correspondingEvaluation1, notCorrespondingEvaluation1, correspondingEvaluation2, alreadyCorrectEvaluation]
    td.when(fakeEvaluationStore.getEvaluationsAsync()).thenResolve(fakeEvaluations);

    const fakeSubscriber = td.object(["evaluations"]);
    eventBus.subscribe(EvaluationUpdatedEvent.type, fakeSubscriber.evaluations);

    const evaluationsReactor = new EvaluationStorageReactors(fakeEvaluationStore as IEvaluationStore);
    evaluationsReactor.registerReactors(eventBus);

    // when
    evaluationCriteria.title = newName;
    evaluationCriteria.rates[1].name = newRateName;
    await eventBus.publishAsync(new EvaluationCriteriaUpdatedEvent(evaluationCriteria));

    // then
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationUpdatedEvent) => arg.entity === correspondingEvaluation1
      && arg.entity.criteriaName === evaluationCriteria.title
      && arg.entity.rateName !== newRateName)), { times: 1 })
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationUpdatedEvent) => arg.entity === correspondingEvaluation2
      && arg.entity.criteriaName === evaluationCriteria.title
      && arg.entity.rateName === newRateName)), { times: 1 })
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationUpdatedEvent) => arg.entity === notCorrespondingEvaluation1)), { times: 0 })
    td.verify(fakeSubscriber.evaluations(td.matchers.argThat((arg: EvaluationUpdatedEvent) => arg.entity === alreadyCorrectEvaluation)), { times: 0 })
  });
});