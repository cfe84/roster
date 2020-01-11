import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Period } from ".";

interface PeriodEditorProps {
  periodName: ActionType,
  period: Period,
  onValidate: ((period: Period) => void),
  onCancel: (() => void)
}

export class PeriodEditorComponent extends Component {

  constructor(private props: PeriodEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const period: Period = objectUtils.clone(this.props.period);
    const saveButtonCaption = `${this.props.periodName || "Create"} period`
    const draftId = this.props.periodName === "Create" ? "new-period-" + this.props.period.personId : this.props.period.id;
    const title = `${this.props.periodName || "New period"} ${period.name}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={period} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(period);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Period name" object={period} field="name" />
        <DateInput class="col" caption="From" object={period} field="fromDate" />
        <DateInput class="col" caption="To" object={period} field="toDate" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const PeriodEditor = (props: PeriodEditorProps) => new PeriodEditorComponent(props);
