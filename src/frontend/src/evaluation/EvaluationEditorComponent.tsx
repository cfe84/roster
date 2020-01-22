import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox, Caption, TextDisplay } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Evaluation } from ".";
import { IEvaluationCriteriaStore } from "../evaluationCriteria";
import { ObservationController } from "../observation";
import { MarkdownDisplay, MarkdownDisplayComponent } from "../baseComponents/MarkdownDisplayComponent";

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
    const saveButtonCaption = `${this.props.actionName || "Create"} evaluation`
    const draftId = this.props.actionName === "Create" ? "new-evaluation-" + this.props.evaluation.periodId : this.props.evaluation.id;
    const title = `${this.props.actionName} ${evaluation.criteriaName || " evaluation"}`;
    const detailsEditor: MarkdownInputComponent = <MarkdownInput caption="Explanation" object={evaluation} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(evaluation);
      detailsEditor.clearDraft();
    };
    const observationsComponent = await this.props.observationController.getCriteriaObservationListComponentAsync(evaluation.periodId, evaluation.criteriaId);
    const ratesComponent = evaluationCriteria?.rates.map((rate) => {
      const onclick = () => {
        evaluation.rateId = rate.id;
        evaluation.rateName = rate.name;
      };
      const input = evaluation.rateId === rate.id
        ? <input type="radio" name="rate" onclick={onclick} checked="true" />
        : <input type="radio" name="rate" onclick={onclick} />
      return <div>
        {input} <b>{rate.name}</b> - <em>{rate.description}</em>
      </div>
    })
    return <div>
      <PageTitle title={title} icon="ruler" onBack={this.props.onCancel} />
      <div class="row">
        <TextDisplay class="col" caption="Evaluated criteria" object={evaluation} field="criteriaName" />
        <DateInput class="col" caption="Date" object={evaluation} field="date" />
      </div>
      <MarkdownDisplay caption="Description of the criteria" object={evaluationCriteria} field="details" />
      {observationsComponent}
      <Caption caption="Rate" />
      <form>{ratesComponent}</form>
      {detailsEditor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationEditor = (props: EvaluationEditorProps) => new EvaluationEditorComponent(props);
