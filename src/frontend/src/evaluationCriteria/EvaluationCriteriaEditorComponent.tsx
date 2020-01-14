import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { EvaluationCriteria } from ".";

interface EvaluationCriteriaEditorProps {
  evaluationCriteriaName: ActionType,
  evaluationCriteria: EvaluationCriteria,
  onValidate: ((evaluationCriteria: EvaluationCriteria) => void),
  onCancel: (() => void)
}

export class EvaluationCriteriaEditorComponent extends Component {

  constructor(private props: EvaluationCriteriaEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const evaluationCriteria: EvaluationCriteria = objectUtils.clone(this.props.evaluationCriteria);
    const saveButtonCaption = `${this.props.evaluationCriteriaName || "Create"} evaluation criteria`
    const draftId = this.props.evaluationCriteriaName === "Create" ? "new-evaluationCriteria-" + this.props.evaluationCriteria : this.props.evaluationCriteria.id;
    const title = `${this.props.evaluationCriteriaName || "New evaluationCriteria"} ${evaluationCriteria.title}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={evaluationCriteria} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(evaluationCriteria);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={evaluationCriteria} field="title" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationCriteriaEditor = (props: EvaluationCriteriaEditorProps) => new EvaluationCriteriaEditorComponent(props);
