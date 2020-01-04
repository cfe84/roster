import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Action } from ".";

interface ActionEditorProps {
  actionName: ActionType,
  action: Action,
  onValidate: ((action: Action) => void),
  onCancel: (() => void)
}

export class ActionEditorComponent extends Component {

  constructor(private props: ActionEditorProps) { super() }

  public render = (): UIElement => {
    const action: Action = objectUtils.clone(this.props.action);
    const saveButtonCaption = `${this.props.actionName || "Create"} action`
    const draftId = this.props.actionName === "Create" ? "new-action-" + this.props.action.personId : this.props.action.id;
    const title = `${this.props.actionName || "New action"} ${action.summary}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={action} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(action);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Summary" object={action} field="summary" />
        <DateInput class="col" caption="Date" object={action} field="dueDate" />
      </div>
      <div class="row">
        <Select class="col" caption="Responsibility" object={action} field="responsibility" values={["mine", "theirs"]} />
        <Checkbox class="col" caption="Done" object={action} field="done" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const ActionEditor = (props: ActionEditorProps) => new ActionEditorComponent(props);
