import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, ListItem, Checkbox } from "../baseComponents";
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

  constructor(private props: EvaluationCriteriaEditorProps) {
    super()
  }

  private formatRates = (rates: Rate[]) =>
    rates
      .sort((a, b) => a.rate - b.rate)
      .map(rate => `${rate.name}: ${rate.description}`)
      .join("\n");

  private parseRates = (ratesAsString: string) =>
    ratesAsString
      .split("\n")
      .map((rateAsString, index) => {
        const idx = rateAsString.indexOf(":");
        if (idx >= 0) {
          const name = rateAsString.substr(0, idx).trim();
          const description = rateAsString.substr(idx + 1);
          return new Rate(index, name, description);
        }
        else {
          return new Rate(index, rateAsString, "");
        }
      })

  public render = (): UIElement => {
    const evaluationCriteria: EvaluationCriteria = objectUtils.clone(this.props.evaluationCriteria);
    const saveButtonCaption = `${this.props.actionName || "Create"} evaluation criteria`
    const draftId = this.props.actionName === "Create" ? "new-evaluationCriteria-" + this.props.evaluationCriteria : this.props.evaluationCriteria.id;
    const title = `${this.props.actionName} ${evaluationCriteria.title || " evaluation criteria"}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={evaluationCriteria} field="details" noteId={draftId} />
    const rates: MarkdownInputComponent = <MarkdownInput
      caption="Rates (Line format = 'rate name: description')"
      onchange={(value) => evaluationCriteria.rates = this.parseRates(value)}
      value={this.formatRates(evaluationCriteria.rates)} />
    const onSave = () => {
      this.props.onValidate(evaluationCriteria);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="balance-scale-left" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={evaluationCriteria} field="title" />
      </div>
      <Checkbox caption="Active" object={evaluationCriteria} field="active" />
      {editor}
      {rates}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const EvaluationCriteriaEditor = (props: EvaluationCriteriaEditorProps) => new EvaluationCriteriaEditorComponent(props);
