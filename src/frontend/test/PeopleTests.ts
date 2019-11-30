import { UIElement, Document } from "../src/html/UIElement";
import should from "should";
import * as td from "testdouble";
import { EventBus } from "../src/events";
import { StorePeopleChangesReactor } from "../src/persons/StorePeopleChangesReactor";
import { PersonCreatedEvent } from "../src/persons/PersonCreatedEvent";
import { IPersonStore } from "../src/persons/IPersonStore";
import { PersonUpdatedEvent } from "../src/persons/PersonUpdatedEvent";

describe("People", () => {
  it("should save people on people created", async () => {
    // given
    const store = td.object(["createPersonAsync"]);
    const reactor = new StorePeopleChangesReactor(store as IPersonStore)
    const bus = new EventBus();
    const person = { "id": "123", "name": "dsfs" };
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
    const bus = new EventBus();
    const person = { "id": "123", "name": "dsfs" };
    const evt = new PersonUpdatedEvent(person);

    // when
    reactor.registerReactors(bus);
    await bus.publishAsync(evt);

    // then
    td.verify(store.updatePersonAsync(person));
  });
})