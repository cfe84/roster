import { UIElement, Component } from "../html/index";
import { Deadline } from "./Deadline";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

interface DeadlineEditorProps {
  actionName?: string,
  deadline: Deadline,
  onValidate: ((deadline: Deadline) => void),
  onCancel: (() => void)
}

export class DeadlineEditorComponent extends Component {

  constructor(private props: DeadlineEditorProps) { super() }

  public render = (): UIElement => {
    const deadline: Deadline = objectUtils.clone(this.props.deadline);
    const saveButtonCaption = `${this.props.actionName || "Create"} deadline`
    const title = `${this.props.actionName || "New deadline"} ${deadline.description}`;
    return <div>
      <PageTitle title={title} icon="calendar-day" onBack={this.props.onCancel} />
      <form class="form-create-element">
        <div class="row">
          <TextInput class="col" caption="Title" object={deadline} field="description" />
          <DateInput class="col-sm" caption="Date" object={deadline} field="deadline" />
        </div>
        <MarkdownInput caption="Meeting notes" object={deadline} field="notes" />
        <Button class="mr-2" onclick={() => { this.props.onValidate(deadline) }} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </form>
    </div>;
  }

}

export const DeadlineEditor = (props: DeadlineEditorProps) => new DeadlineEditorComponent(props);