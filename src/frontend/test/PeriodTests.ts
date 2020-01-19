import { EventBus } from "../lib/common/events";
import { Person } from "../src/persons";
import * as td from "testdouble";
import { PeriodDeletedEvent, PeriodCreatedEvent, PeriodUpdatedEvent } from "../src/period/PeriodEvents";
import { PeriodStorageReactors } from "../src/period/PeriodStorageReactors";
import { IPeriodStore, Period } from "../src/period";
import { PersonDeletedEvent } from "../src/persons/PersonEvent";

describe("Period domain", () => {
  const createStore = (storeName: string) => td.object([`get${storeName}sAsync`, `create${storeName}Async`, `update${storeName}Async`, `delete${storeName}Async`])

  it("should create periods on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const period = new Period("123");
    const event = new PeriodCreatedEvent(period);

    const fakePeriodStore = createStore("Period") as IPeriodStore;
    const periodsReactor = new PeriodStorageReactors(fakePeriodStore as IPeriodStore);
    periodsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakePeriodStore.createPeriodAsync(period));
  })

  it("should update periods on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const period = new Period("123");
    const event = new PeriodUpdatedEvent(period);

    const fakePeriodStore = createStore("Period") as IPeriodStore;
    const periodsReactor = new PeriodStorageReactors(fakePeriodStore as IPeriodStore);
    periodsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakePeriodStore.updatePeriodAsync(period));
  })

  it("should delete periods on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const period = new Period("123");
    const event = new PeriodDeletedEvent(period);

    const fakePeriodStore = createStore("Period") as IPeriodStore;
    const periodsReactor = new PeriodStorageReactors(fakePeriodStore as IPeriodStore);
    periodsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakePeriodStore.deletePeriodAsync(period));
  })

  it("should delete all evaluations of a deleted person", async () => {
    // given
    const eventBus = new EventBus("", false);
    const person: Person = {
      id: "fake id",
      name: "fake name", position: "", role: ""
    }

    const fakePeriodStore = createStore("Period");
    const fakePeriods = [{ personId: person.id }, { personId: "dsfsd" }, { personId: person.id }]
    td.when(fakePeriodStore.getPeriodsAsync()).thenResolve(fakePeriods);

    const fakeSubscriber = td.object(["periods"]);
    eventBus.subscribe(PeriodDeletedEvent.type, fakeSubscriber.periods);

    const periodsReactor = new PeriodStorageReactors(fakePeriodStore as IPeriodStore);
    periodsReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new PersonDeletedEvent(person));

    // then
    td.verify(fakeSubscriber.periods(td.matchers.argThat((arg: PeriodDeletedEvent) => arg.entity === fakePeriods[0])))
    td.verify(fakeSubscriber.periods(td.matchers.argThat((arg: PeriodDeletedEvent) => arg.entity === fakePeriods[1])), { times: 0 })
    td.verify(fakeSubscriber.periods(td.matchers.argThat((arg: PeriodDeletedEvent) => arg.entity === fakePeriods[2])))
  })
});