import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, CheckboxDisplay, Checkbox } from "../baseComponents";
import { Action } from ".";
import { GENERIC_CONTROLLER_EVENT_TYPES } from "../baseComponents/GenericController";

interface ActionReaderProps {
  action: Action,
  onCompleteChanged: (value: boolean) => void,
  onEdit: ((action: Action) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class ActionReaderComponent extends Component {

  constructor(public props: ActionReaderProps) { super() }

  public render = (): UIElement => {
    const action = this.props.action;
    const notes = <MarkdownDisplay
      caption="Details"
      value={action.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={action.summary} icon="tasks" onBack={this.props.onBack} />
      <div class="row">
        <TextDisplay class="col" caption="Responsibility" object={this.props.action} field="responsibility" />
        <DateDisplay class="col" caption="Due date" object={this.props.action} field="dueDate" includeTimespan={true} />
        <Checkbox class="col" caption="Completed" object={this.props.action} field="completed" onchange={this.props.onCompleteChanged} />
        <DateDisplay class="col" caption="Completion date" object={this.props.action} field="completionDate" />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(action)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }

  public on = (eventType: string, data: any) => {
    if (eventType === GENERIC_CONTROLLER_EVENT_TYPES.ENTITY_UPDATED) {
      this.props.action = data;
    }
  }
}

export const ActionReader = (props: ActionReaderProps) => new ActionReaderComponent(props);
