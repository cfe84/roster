import { ListComponent, List } from "../baseComponents/ListComponent";
import { Discussion } from ".";
import { IStore } from "../storage/IStore";
import { Component, UIContainer } from "../html";
import { IDiscussionStore } from "./IDiscussionStore";
import { EventBus } from "../events";
import { PersonId } from "../persons";
import { DiscussionEditor } from "./DiscussionEditorComponent";
import { dateUtils } from "../utils/dateUtils";
import { GUID } from "../utils/guid";
import { DiscussionCreatedEvent } from "./DiscussionCreatedEvent";
import { DiscussionUpdatedEvent } from "./DiscussionUpdatedEvent";
import { DiscussionReader, DiscussionReaderComponent } from "./DiscussionReaderComponent";
import { ConfirmationDialog } from "../baseComponents/ConfirmationDialog";
import { DiscussionDeletedEvent } from "./DiscussionDeletedEvent";

export interface DiscussionControllerDependencies {
  db: IDiscussionStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

export class DiscussionController {

  constructor(private deps: DiscussionControllerDependencies) { }

  public getDiscussionListAsync = async (personId: PersonId): Promise<ListComponent<Discussion>> => {
    const discussions = (await this.deps.db.getDiscussionsAsync())
      .filter((discussion) => discussion.personId === personId)
      .sort((a, b) => a.date < b.date ? 1 : -1);
    const elementDisplay = (discussion: Discussion) => <span><span>{discussion.description}</span> - <span class="text-secondary">{dateUtils.timeSpan(discussion.date)}<i> ({dateUtils.format(discussion.date)})</i></span></span>
    const component = <List
      title="Discussions"
      titleIcon="comments"
      elements={discussions}
      onAddClicked={() => { this.loadCreateDiscussion(personId) }}
      onEditClicked={(discussion: Discussion) => { this.loadEditDiscussion(discussion) }}
      onClicked={(discussion: Discussion) => { this.loadReadDiscussion(discussion) }}
      elementDisplay={elementDisplay}
    ></List>
      ;
    return component;
  }

  public loadCreateDiscussion = (personId: PersonId, name: string = "Discussion") => {
    const discussion: Discussion = {
      notes: "",
      preparation: "",
      date: new Date(),
      description: name,
      id: GUID.newGuid(),
      personId: personId
    }
    const component = <DiscussionEditor
      actionName="Create"
      discussion={discussion}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={(discussion: Discussion) => {
        this.deps.eventBus.publishAsync(new DiscussionCreatedEvent(discussion))
          .then(() => this.deps.uiContainer.unmountCurrent())
      }}
    ></DiscussionEditor>
    this.deps.uiContainer.mount(component);
  }

  public loadEditDiscussion = (discussion: Discussion) => {
    const component = <DiscussionEditor
      actionName="Update"
      discussion={discussion}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={(dis: Discussion) => {
        this.deps.eventBus.publishAsync(new DiscussionUpdatedEvent(dis))
          .then(() => this.deps.uiContainer.unmountCurrent())
      }}
    ></DiscussionEditor>
    this.deps.uiContainer.mount(component);
  }

  public loadReadDiscussion = (discussion: Discussion) => {
    const component: DiscussionReaderComponent = <DiscussionReader
      discussion={discussion}
      onBack={this.deps.uiContainer.unmountCurrent}
      onDelete={() => { this.displayDeleteDiscussion(discussion) }}
      onEdit={() => this.loadEditDiscussion(discussion)}
    ></DiscussionReader>
    const updateSubscription = this.deps.eventBus.subscribe(DiscussionUpdatedEvent.type, (evt: DiscussionUpdatedEvent) => {
      if (evt.discussion.id === discussion.id)
        component.props.discussion = evt.discussion;
      this.deps.uiContainer.rerenderIfCurrent(component);
    });
    component.ondispose = () => {
      updateSubscription.unsubscribe()
    };
    this.deps.uiContainer.mount(component);
  }

  private displayDeleteDiscussion = (discussion: Discussion): void => {
    const deleteNote = () => {
      this.deps.eventBus.publishAsync(new DiscussionDeletedEvent(discussion))
        .then(() => this.deps.uiContainer.unmountCurrent());
    }
    const component = <ConfirmationDialog
      oncancel={this.deps.uiContainer.unmountCurrent}
      onyes={deleteNote}
      text={`Are you sure you want to delete discussion "${discussion.description}"?`}
      title="Confirm deletion" />
    this.deps.uiContainer.mount(component);
  }
}