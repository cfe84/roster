import { UIElement, Component } from "../html/index";
import { Deadline } from "./Deadline";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";

interface DeadlineEditorProps {
  actionName: ActionType,
  deadline: Deadline,
  onValidate: ((deadline: Deadline) => void),
  onCancel: (() => void)
}

export class DeadlineEditorComponent extends Component {

  constructor(private props: DeadlineEditorProps) { super() }

  public render = (): UIElement => {
    const deadline: Deadline = objectUtils.clone(this.props.deadline);
    const saveButtonCaption = `${this.props.actionName || "Create"} deadline`
    const draftId = this.props.actionName === "Create" ? "new-" + this.props.deadline.personId : this.props.deadline.id;
    const title = `${this.props.actionName || "New deadline"} ${deadline.description}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Meeting notes" object={deadline} field="notes" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(deadline);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="calendar-day" onBack={this.props.onCancel} />
      <div class="form-create-element">
        <div class="row">
          <TextInput class="col" caption="Title" object={deadline} field="description" />
          <DateInput class="col-sm" caption="Date" object={deadline} field="deadline" />
        </div>
        {editor}
        <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </div>
    </div>;
  }

}

export const DeadlineEditor = (props: DeadlineEditorProps) => new DeadlineEditorComponent(props);
