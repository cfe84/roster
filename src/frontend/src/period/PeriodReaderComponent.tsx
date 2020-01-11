import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Period } from ".";

interface PeriodReaderProps {
  period: Period,
  onCompleteChanged: (value: boolean) => void,
  onEdit: ((period: Period) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class PeriodReaderComponent extends Component {

  constructor(public props: PeriodReaderProps) { super() }

  public render = (): UIElement => {
    const period = this.props.period;
    const notes = <MarkdownDisplay
      caption="Details"
      value={period.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={period.name} iconRegular={true} icon="calendar-alt" onBack={this.props.onBack} />
      <div class="row">
        <DateDisplay class="col" caption="Start date" object={this.props.period} field="startDate" includeTimespan={true} />
        <DateDisplay class="col" caption="Finish date" object={this.props.period} field="finishDate" includeTimespan={true} />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(period)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const PeriodReader = (props: PeriodReaderProps) => new PeriodReaderComponent(props);
