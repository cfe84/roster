import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Observation } from ".";

interface ObservationEditorProps {
  observationName: ActionType,
  observation: Observation,
  onValidate: ((observation: Observation) => void),
  onCancel: (() => void)
}

export class ObservationEditorComponent extends Component {

  constructor(private props: ObservationEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const observation: Observation = objectUtils.clone(this.props.observation);
    const saveButtonCaption = `${this.props.observationName || "Create"} observation`
    const draftId = this.props.observationName === "Create" ? "new-observation-" + this.props.observation.periodId : this.props.observation.id;
    const title = `${this.props.observationName || "New observation"} ${observation.title}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={observation} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(observation);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={observation} field="title" />
        <DateInput class="col" caption="Date" object={observation} field="date" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const ObservationEditor = (props: ObservationEditorProps) => new ObservationEditorComponent(props);
