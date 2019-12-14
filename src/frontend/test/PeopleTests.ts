import should from "should";
import * as td from "testdouble";
import { EventBus } from "../lib/common/events";
import { StorePeopleChangesReactor } from "../src/persons/StorePeopleChangesReactor";
import { PersonCreatedEvent } from "../src/persons/PersonCreatedEvent";
import { IPersonStore } from "../src/persons/IPersonStore";
import { PersonUpdatedEvent } from "../src/persons/PersonUpdatedEvent";
import { Person } from "../src/persons";

describe("People", () => {
  it("should save people on people created", async () => {
    // given
    const store = td.object(["createPersonAsync"]);
    const reactor = new StorePeopleChangesReactor(store as IPersonStore)
    const bus = new EventBus("");
    const person: Person = { "id": "123", "name": "dsfs", inCompanySince: undefined, inPositionSince: undefined, inTeamSince: undefined, position: "sdfs", role: "dfsdf" };
    const evt = new PersonCreatedEvent(person);

    // when
    reactor.registerReactors(bus);
    await bus.publishAsync(evt);

    // then
    td.verify(store.createPersonAsync(person));
  });

  it("should update people on people updated", async () => {
    // given
    const store = td.object(["updatePersonAsync"]);
    const reactor = new StorePeopleChangesReactor(store as IPersonStore)
    const bus = new EventBus("");
    const person: Person = { "id": "123", "name": "dsfs", inCompanySince: undefined, inPositionSince: undefined, inTeamSince: undefined, position: "sdfs", role: "dfsdf" };
    const evt = new PersonUpdatedEvent(person);

    // when
    reactor.registerReactors(bus);
    await bus.publishAsync(evt);

    // then
    td.verify(store.updatePersonAsync(person));
  });
})