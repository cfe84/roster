import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay } from "../baseComponents";
import { Action } from ".";

interface ActionReaderProps {
  action: Action,
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
      <div class="row">
        <PageTitle title={action.summary} icon="tasks" onBack={this.props.onBack} />
        <DateDisplay caption="Due date" object={this.props.action} field="dueDate" includeTimespan={true} />
      </div>
      <div class="row">
        <TextDisplay caption="Responsibility" object={this.props.action} field="responsibility" />
        <TextDisplay caption="Done" object={this.props.action} field="done" />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(action)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const ActionReader = (props: ActionReaderProps) => new ActionReaderComponent(props);
