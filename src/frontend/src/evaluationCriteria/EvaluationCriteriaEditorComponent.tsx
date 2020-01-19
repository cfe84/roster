import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, ListItem, Checkbox, Caption } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { EvaluationCriteria } from ".";
import { List } from "../baseComponents/ListComponent";
import { Rate } from "./EvaluationCriteria";

interface EvaluationCriteriaEditorProps {
  actionName: ActionType,
  evaluationCriteria: EvaluationCriteria,
  onValidate: ((evaluationCriteria: EvaluationCriteria) => void),
  onCancel: (() => void)
}

export class EvaluationCriteriaEditorComponent extends Component {

  private rateNameIndex: number;
  private rateIdIndex: number;
  private rateDescriptionIndex: number;
  constructor(private props: EvaluationCriteriaEditorProps) {
    super()
    this.rateIdIndex = props.actionName === "Create" ? -1 : 0;
    this.rateNameIndex = this.rateIdIndex + 1;
    this.rateDescriptionIndex = this.rateNameIndex + 1;
  }

  private formatRates = (rates: Rate[]) =>
    rates
      .sort((a, b) => a.order - b.order)
      .map(rate => `${rate.id}: ${rate.name}: ${rate.description}`)
      .join("\n");

  private parseRates = (ratesAsString: string) =>
    ratesAsString
      .split("\n")
      .map((rateAsString, order) => {
        const rateAsStringArray = rateAsString.split(":").map((rate) => rate.trim());
        const rate = new Rate(order, rateAsStringArray[this.rateNameIndex], rateAsStringArray[this.rateDescriptionIndex]);
        if (this.rateIdIndex >= 0) {
          rate.id = rateAsStringArray[this.rateIdIndex];
        }
        return rate;
      })

  public render = (): UIElement => {
    const evaluationCriteria: EvaluationCriteria = objectUtils.clone(this.props.evaluationCriteria);
    const saveButtonCaption = `${this.props.actionName || "Create"} evaluation criteria`
    const draftId = this.props.actionName === "Create" ? "new-evaluationCriteria-" + this.props.evaluationCriteria : this.props.evaluationCriteria.id;
    const title = `${this.props.actionName} ${evaluationCriteria.title || " evaluation criteria"}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={evaluationCriteria} field="details" noteId={draftId} />
    const rates: MarkdownInputComponent = <MarkdownInput
      onchange={(value) => evaluationCriteria.rates = this.parseRates(value)}
      value={this.formatRates(evaluationCriteria.rates)} />
    const onSave = () => {
      this.props.onValidate(evaluationCriteria);
      editor.clearDraft();
    };
    const dontChangeIdWarningComponent = this.props.actionName === "Update"
      ? <span>You can change order, but <b>don't change or remove ids</b>, or this will cause evaluation data loss.</span>
      : ""
    return <div>
      <PageTitle title={title} icon="balance-scale-left" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={evaluationCriteria} field="title" />
      </div>
      <Checkbox caption="Active" object={evaluationCriteria} field="active" />
      {editor}
      <Caption caption="Rates" />
      <em>Each line is formatted as follow. {dontChangeIdWarningComponent}
        <pre>{this.props.actionName === "Update" ? "rateId: " : ""}rate name: rate description</pre></em>
      {rates}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationCriteriaEditor = (props: EvaluationCriteriaEditorProps) => new EvaluationCriteriaEditorComponent(props);
