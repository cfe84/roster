import { ListComponent, List } from "../baseComponents/ListComponent";
import { Deadline } from ".";
import { IStore } from "../storage/IStore";
import { Component, UIContainer } from "../html";
import { IDeadlineStore } from "./IDeadlineStore";
import { EventBus } from "../../lib/common/events/";
import { PersonId } from "../persons";
import { DeadlineEditor } from "./DeadlineEditorComponent";
import { dateUtils } from "../utils/dateUtils";
import { GUID } from "../../lib/common/utils/guid";
import { DeadlineReader, DeadlineReaderComponent } from "./DeadlineReaderComponent";
import { ConfirmationDialog } from "../baseComponents/ConfirmationDialog";
import { DeadlineCreatedEvent, DeadlineUpdatedEvent, DeadlineDeletedEvent } from "./DeadlineEvents";

export interface DeadlineControllerDependencies {
  db: IDeadlineStore,
  eventBus: EventBus,
  uiContainer: UIContainer
}

export class DeadlineController {

  constructor(private deps: DeadlineControllerDependencies) { }

  public getDeadlineListAsync = async (personId?: PersonId): Promise<ListComponent<Deadline>> => {
    const deadlines = (await this.deps.db.getDeadlinesAsync())
      .filter((deadline) => !personId || deadline.personId === personId)
      .sort((a, b) => a.deadline > b.deadline ? 1 : -1);
    const elementDisplay = (deadline: Deadline) =>
      <span><i class="fa fa-map-marker"></i> {dateUtils.format(deadline.deadline)} <i>({dateUtils.timeSpan(deadline.deadline)})</i>: <b>{deadline.description}</b></span>;
    const component = <List
      title="Deadlines"
      titleIcon="calendar-day"
      elements={deadlines}
      onAddClicked={personId ? (() => { this.loadCreateDeadline(personId) }) : undefined}
      onEditClicked={this.loadEditDeadline}
      onClicked={(deadline: Deadline) => { this.loadReadDeadline(deadline) }}
      elementDisplay={elementDisplay}
    > </List>;
    return component;
  }

  public loadCreateDeadline = (personId: PersonId, name: string = "Deadline") => {
    const deadline: Deadline = {
      notes: "",
      deadline: new Date(),
      done: false,
      description: name,
      id: GUID.newGuid(),
      personId: personId
    }
    const component = <DeadlineEditor
      actionName="Create"
      deadline={deadline}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={(deadline: Deadline) => {
        this.deps.eventBus.publishAsync(new DeadlineCreatedEvent(deadline))
          .then(() => this.deps.uiContainer.unmountCurrent())
      }
      }
    > </DeadlineEditor>
    this.deps.uiContainer.mount(component);
  }

  public loadEditDeadline = (deadline: Deadline) => {
    const component = <DeadlineEditor
      actionName="Update"
      deadline={deadline}
      onCancel={this.deps.uiContainer.unmountCurrent}
      onValidate={(dis: Deadline) => {
        this.deps.eventBus.publishAsync(new DeadlineUpdatedEvent(dis))
          .then(() => this.deps.uiContainer.unmountCurrent())
      }
      }
    > </DeadlineEditor>
    this.deps.uiContainer.mount(component);
  }

  public loadReadDeadline = (deadline: Deadline) => {
    const component: DeadlineReaderComponent = <DeadlineReader
      deadline={deadline}
      onBack={this.deps.uiContainer.unmountCurrent}
      onDelete={() => { this.displayDeleteDeadline(deadline) }
      }
      onEdit={this.loadEditDeadline}
    > </DeadlineReader>
    const updateSubscription = this.deps.eventBus.subscribe(DeadlineUpdatedEvent.type, (evt: DeadlineUpdatedEvent) => {
      if (evt.deadline.id === deadline.id)
        component.props.deadline = evt.deadline;
      this.deps.uiContainer.rerenderIfCurrent(component);
    });
    component.ondispose = () => {
      updateSubscription.unsubscribe()
    };
    this.deps.uiContainer.mount(component);
  }

  private displayDeleteDeadline = (deadline: Deadline): void => {
    const deleteNote = () => {
      this.deps.eventBus.publishAsync(new DeadlineDeletedEvent(deadline))
        .then(() => this.deps.uiContainer.unmountCurrent());
    }
    const component = <ConfirmationDialog
      oncancel={this.deps.uiContainer.unmountCurrent}
      onyes={deleteNote}
      text={`Are you sure you want to delete deadline "${deadline.description}"?`
      }
      title="Confirm deletion" />
    this.deps.uiContainer.mount(component);
  }
}