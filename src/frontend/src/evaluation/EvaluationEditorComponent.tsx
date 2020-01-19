import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Evaluation } from ".";

interface EvaluationEditorProps {
  actionName: ActionType,
  evaluation: Evaluation,
  onValidate: ((evaluation: Evaluation) => void),
  onCancel: (() => void)
}

export class EvaluationEditorComponent extends Component {

  constructor(private props: EvaluationEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const evaluation: Evaluation = objectUtils.clone(this.props.evaluation);
    const saveButtonCaption = `${this.props.actionName || "Create"} evaluation`
    const draftId = this.props.actionName === "Create" ? "new-evaluation-" + this.props.evaluation.periodId : this.props.evaluation.id;
    const title = `${this.props.actionName} ${evaluation.title || "new evaluation"}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={evaluation} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(evaluation);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="ruler" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={evaluation} field="title" />
        <DateInput class="col" caption="Date" object={evaluation} field="date" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationEditor = (props: EvaluationEditorProps) => new EvaluationEditorComponent(props);
