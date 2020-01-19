import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox, Caption } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Evaluation } from ".";
import { IEvaluationCriteriaStore } from "../evaluationCriteria";
import { ObservationController } from "../observation";

interface EvaluationEditorProps {
  actionName: ActionType,
  evaluation: Evaluation,
  evaluationCriteriaStore: IEvaluationCriteriaStore,
  observationController: ObservationController,
  onValidate: ((evaluation: Evaluation) => void),
  onCancel: (() => void)
}

export class EvaluationEditorComponent extends Component {

  constructor(private props: EvaluationEditorProps) {
    super()
  }

  public render = async (): Promise<UIElement> => {
    const evaluation: Evaluation = objectUtils.clone(this.props.evaluation);
    const evaluationCriteria = (await this.props.evaluationCriteriaStore.getEvaluationCriteriasAsync())
      .find((criteria) => criteria.id === evaluation.criteriaId);
    if (!evaluation.rateName) {
      if (evaluation.rate === undefined) {
        evaluation.rate = 0;
      }
      evaluation.rateName = evaluationCriteria?.rates[evaluation.rate].name || "";
    }
    const saveButtonCaption = `${this.props.actionName || "Create"} evaluation`
    const draftId = this.props.actionName === "Create" ? "new-evaluation-" + this.props.evaluation.periodId : this.props.evaluation.id;
    const title = `${this.props.actionName} ${evaluation.title || " evaluation"} for ${evaluationCriteria?.title}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Explanation" object={evaluation} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(evaluation);
      editor.clearDraft();
    };
    const observationsComponent = await this.props.observationController.getCriteriaObservationListComponentAsync(evaluation.periodId, evaluation.criteriaId);
    const rates = evaluationCriteria?.rates.map((rate) => {
      const onclick = () => {
        evaluation.rate = rate.rate;
        evaluation.rateName = rate.name;
      };
      const input = evaluation.rate === rate.rate
        ? <input type="radio" name="rate" onclick={onclick} checked="true" />
        : <input type="radio" name="rate" onclick={onclick} />
      return <div>
        {input} {rate.rate} - <b>{rate.name}</b> - <em>{rate.description}</em>
      </div>
    })
    return <div>
      <PageTitle title={title} icon="ruler" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={evaluation} field="title" />
        <DateInput class="col" caption="Date" object={evaluation} field="date" />
      </div>
      {observationsComponent}
      <Caption caption="Rate" />
      <form>{rates}</form>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationEditor = (props: EvaluationEditorProps) => new EvaluationEditorComponent(props);
