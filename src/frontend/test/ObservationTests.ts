import { EventBus } from "../lib/common/events";
import * as td from "testdouble";
import { ObservationDeletedEvent, ObservationCreatedEvent, ObservationUpdatedEvent } from "../src/observation/ObservationEvents";
import { ObservationStorageReactors } from "../src/observation/ObservationStorageReactors";
import { IObservationStore, Observation } from "../src/observation";
import { Period } from "../src/period";
import { PeriodDeletedEvent } from "../src/period/PeriodEvents";
import { EvaluationCriteria } from "../src/evaluationCriteria";
import { EvaluationCriteriaDeletedEvent, EvaluationCriteriaUpdatedEvent } from "../src/evaluationCriteria/EvaluationCriteriaEvents";

describe("Observation domain", () => {
  const createStore = (storeName: string) => td.object([`get${storeName}sAsync`, `create${storeName}Async`, `update${storeName}Async`, `delete${storeName}Async`])

  it("should create observations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const observation = new Observation("123");
    const event = new ObservationCreatedEvent(observation);

    const fakeObservationStore = createStore("Observation") as IObservationStore;
    const observationsReactor = new ObservationStorageReactors(fakeObservationStore as IObservationStore);
    observationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeObservationStore.createObservationAsync(observation));
  })

  it("should update observations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const observation = new Observation("123");
    const event = new ObservationUpdatedEvent(observation);

    const fakeObservationStore = createStore("Observation") as IObservationStore;
    const observationsReactor = new ObservationStorageReactors(fakeObservationStore as IObservationStore);
    observationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeObservationStore.updateObservationAsync(observation));
  })

  it("should delete observations on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const observation = new Observation("123");
    const event = new ObservationDeletedEvent(observation);

    const fakeObservationStore = createStore("Observation") as IObservationStore;
    const observationsReactor = new ObservationStorageReactors(fakeObservationStore as IObservationStore);
    observationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeObservationStore.deleteObservationAsync(observation));
  })

  it("should delete all observations of a deleted period", async () => {
    // given
    const eventBus = new EventBus("", false);
    const period: Period = new Period("1423");

    const fakeObservationStore = createStore("Observation");
    const correspondingObservation1 = new Observation(period.id);
    const notCorrespondingObservation = new Observation("fddgh");
    const correspondingObservation2 = new Observation(period.id);
    const fakeObservations = [correspondingObservation1, notCorrespondingObservation, correspondingObservation2]
    td.when(fakeObservationStore.getObservationsAsync()).thenResolve(fakeObservations);

    const fakeSubscriber = td.object(["observations"]);
    eventBus.subscribe(ObservationDeletedEvent.type, fakeSubscriber.observations);

    const observationsReactor = new ObservationStorageReactors(fakeObservationStore as IObservationStore);
    observationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new PeriodDeletedEvent(period));

    // then
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationDeletedEvent) => arg.entity === correspondingObservation1)))
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationDeletedEvent) => arg.entity === correspondingObservation2)))
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationDeletedEvent) => arg.entity === notCorrespondingObservation)), { times: 0 })
  })

  it("should remove deleted criteria from observed criteria lists", async () => {
    // given
    const eventBus = new EventBus("", false);
    const evaluationCriteria = new EvaluationCriteria();

    const fakeObservationStore = createStore("Observation");
    const correspondingObservation1 = new Observation("sdfgd");
    correspondingObservation1.observedCriteriaIds.push("dsgdfbdvbdb");
    correspondingObservation1.observedCriteriaIds.push(evaluationCriteria.id);
    correspondingObservation1.observedCriteriaIds.push("dsgdfsdgfdbdb");
    const correspondingObservation2 = new Observation("sdggfd");
    correspondingObservation2.observedCriteriaIds.push("2409gkvsd");
    correspondingObservation2.observedCriteriaIds.push(evaluationCriteria.id);
    const notCorrespondingObservation = new Observation("fddgh");
    notCorrespondingObservation.observedCriteriaIds.push("2409gkvsd");
    const fakeObservations = [correspondingObservation1, notCorrespondingObservation, correspondingObservation2]
    td.when(fakeObservationStore.getObservationsAsync()).thenResolve(fakeObservations);

    const fakeSubscriber = td.object(["observations"]);
    eventBus.subscribe(ObservationUpdatedEvent.type, fakeSubscriber.observations);

    const observationsReactor = new ObservationStorageReactors(fakeObservationStore as IObservationStore);
    observationsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new EvaluationCriteriaDeletedEvent(evaluationCriteria));

    // then
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationUpdatedEvent) => arg.entity === correspondingObservation1)))
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationUpdatedEvent) => arg.entity === correspondingObservation2)))
    td.verify(fakeSubscriber.observations(td.matchers.argThat((arg: ObservationUpdatedEvent) => arg.entity === notCorrespondingObservation)), { times: 0 })
  });
});