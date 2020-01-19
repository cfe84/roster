import { EventBus } from "../lib/common/events";
import { Person } from "../src/persons";
import * as td from "testdouble";
import { TemplateDeletedEvent, TemplateCreatedEvent, TemplateUpdatedEvent } from "../src/template/TemplateEvents";
import { TemplateStorageReactors } from "../src/template/TemplateStorageReactors";
import { ITemplateStore, Template } from "../src/template";
import { PersonDeletedEvent } from "../src/persons/PersonEvent";

describe("Template domain", () => {
  const createStore = (storeName: string) => td.object([`get${storeName}sAsync`, `create${storeName}Async`, `update${storeName}Async`, `delete${storeName}Async`])

  it("should create templates on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const template = new Template("123");
    const event = new TemplateCreatedEvent(template);

    const fakeTemplateStore = createStore("Template") as ITemplateStore;
    const templatesReactor = new TemplateStorageReactors(fakeTemplateStore as ITemplateStore);
    templatesReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeTemplateStore.createTemplateAsync(template));
  })

  it("should update templates on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const template = new Template("123");
    const event = new TemplateUpdatedEvent(template);

    const fakeTemplateStore = createStore("Template") as ITemplateStore;
    const templatesReactor = new TemplateStorageReactors(fakeTemplateStore as ITemplateStore);
    templatesReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeTemplateStore.updateTemplateAsync(template));
  })

  it("should delete templates on event", async () => {
    // given
    const eventBus = new EventBus("", false);
    const template = new Template("123");
    const event = new TemplateDeletedEvent(template);

    const fakeTemplateStore = createStore("Template") as ITemplateStore;
    const templatesReactor = new TemplateStorageReactors(fakeTemplateStore as ITemplateStore);
    templatesReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(event);

    // then
    td.verify(fakeTemplateStore.deleteTemplateAsync(template));
  })

  it("should delete all evaluations of a deleted person", async () => {
    // given
    const eventBus = new EventBus("", false);
    const person: Person = {
      id: "fake id",
      name: "fake name", position: "", role: ""
    }

    const fakeTemplateStore = createStore("Template");
    const fakeTemplates = [{ personId: person.id }, { personId: "dsfsd" }, { personId: person.id }]
    td.when(fakeTemplateStore.getTemplatesAsync()).thenResolve(fakeTemplates);

    const fakeSubscriber = td.object(["templates"]);
    eventBus.subscribe(TemplateDeletedEvent.type, fakeSubscriber.templates);

    const templatesReactor = new TemplateStorageReactors(fakeTemplateStore as ITemplateStore);
    templatesReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new PersonDeletedEvent(person));

    // then
    td.verify(fakeSubscriber.templates(td.matchers.argThat((arg: TemplateDeletedEvent) => arg.entity === fakeTemplates[0])))
    td.verify(fakeSubscriber.templates(td.matchers.argThat((arg: TemplateDeletedEvent) => arg.entity === fakeTemplates[1])), { times: 0 })
    td.verify(fakeSubscriber.templates(td.matchers.argThat((arg: TemplateDeletedEvent) => arg.entity === fakeTemplates[2])))
  })
});