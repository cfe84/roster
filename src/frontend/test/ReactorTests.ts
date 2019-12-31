import should from "should";
import td from "testdouble";
import { StoreNotesChangesReactor } from "../src/notes";
import { EventBus } from "../lib/common/events";
import { Person } from "../src/persons";
import { PersonDeletedEvent } from "../src/persons/PersonEvent";
import { NoteDeletedEvent } from "../src/notes/NoteEvents";
import { StoreDiscussionsChangesReactor } from "../src/discussions/StoreDiscussionsChangesReactor";
import { INotesStore } from "../src/notes/INotesStore";
import { IDiscussionStore } from "../src/discussions/IDiscussionStore";
import { IDeadlineStore } from "../src/deadlines/IDeadlineStore";
import { StoreDeadlinesChangesReactor } from "../src/deadlines/StoreDeadlinesChangesReactor";
import { DiscussionDeletedEvent } from "../src/discussions/DiscussionEvents";
import { DeadlineDeletedEvent } from "../src/deadlines/DeadlineEvents";

describe("Reactors", () => {
  it("should delete all notes of a deleted person", async () => {
    // given
    const eventBus = new EventBus("", false);
    const p: Person = {
      id: "sdfsdfowmrobem",
      name: "", position: "", role: ""
    }
    const createStore = (storeName: string) => td.object([`get${storeName}sAsync`, `create${storeName}Async`, `update${storeName}Async`, `delete${storeName}Async`])

    const fakeNotesStore = createStore("Note");
    const fakeNotes = [{ personId: p.id }, { personId: "dsfsd" }, { personId: p.id }]
    td.when(fakeNotesStore.getNotesAsync()).thenResolve(fakeNotes);

    const fakeDiscussionsStore = createStore("Discussion");
    const fakeDiscussions = [{ personId: p.id }, { personId: "dsfsd" }, { personId: p.id }]
    td.when(fakeDiscussionsStore.getDiscussionsAsync()).thenResolve(fakeDiscussions);

    const fakeDeadlinesStore = createStore("Deadline");
    const fakeDeadlines = [{ personId: p.id }, { personId: "dsfsd" }, { personId: p.id }]
    td.when(fakeDeadlinesStore.getDeadlinesAsync()).thenResolve(fakeDeadlines);

    const fakeSubscriber = td.object(["notes", "discussions", "deadlines"]);
    eventBus.subscribe(NoteDeletedEvent.type, fakeSubscriber.notes);
    eventBus.subscribe(DiscussionDeletedEvent.type, fakeSubscriber.discussions);
    eventBus.subscribe(DeadlineDeletedEvent.type, fakeSubscriber.deadlines);

    const notesReactor = new StoreNotesChangesReactor(fakeNotesStore as INotesStore);
    const discReactor = new StoreDiscussionsChangesReactor(fakeDiscussionsStore as IDiscussionStore);
    const deadlineReactor = new StoreDeadlinesChangesReactor(fakeDeadlinesStore as IDeadlineStore);

    notesReactor.registerReactors(eventBus);
    discReactor.registerReactors(eventBus);
    deadlineReactor.registerReactors(eventBus);

    // when
    await eventBus.publishAsync(new PersonDeletedEvent(p));

    // then
    td.verify(fakeSubscriber.notes(td.matchers.argThat((arg: NoteDeletedEvent) => arg.note === fakeNotes[0])))
    td.verify(fakeSubscriber.notes(td.matchers.argThat((arg: NoteDeletedEvent) => arg.note === fakeNotes[1])), { times: 0 })
    td.verify(fakeSubscriber.notes(td.matchers.argThat((arg: NoteDeletedEvent) => arg.note === fakeNotes[2])))
    td.verify(fakeSubscriber.discussions(td.matchers.argThat((arg: DiscussionDeletedEvent) => arg.discussion === fakeDiscussions[0])))
    td.verify(fakeSubscriber.discussions(td.matchers.argThat((arg: DiscussionDeletedEvent) => arg.discussion === fakeDiscussions[1])), { times: 0 })
    td.verify(fakeSubscriber.discussions(td.matchers.argThat((arg: DiscussionDeletedEvent) => arg.discussion === fakeDiscussions[2])))
    td.verify(fakeSubscriber.deadlines(td.matchers.argThat((arg: DeadlineDeletedEvent) => arg.deadline === fakeDeadlines[0])))
    td.verify(fakeSubscriber.deadlines(td.matchers.argThat((arg: DeadlineDeletedEvent) => arg.deadline === fakeDeadlines[1])), { times: 0 })
    td.verify(fakeSubscriber.deadlines(td.matchers.argThat((arg: DeadlineDeletedEvent) => arg.deadline === fakeDeadlines[2])))
  })
})