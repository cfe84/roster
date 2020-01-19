import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Period } from ".";
import { EvaluationCriteriaController } from "../evaluationCriteria";
import { ObservationController } from "../observation";
import { EvaluationController } from "../evaluation";

interface PeriodReaderProps {
  period: Period,
  onCompleteChanged: (value: boolean) => void,
  onEdit: ((period: Period) => void),
  onDelete: (() => void),
  onBack: (() => void),
  evaluationCriteriaController: EvaluationCriteriaController,
  evaluationController: EvaluationController,
  observationController: ObservationController
}

export class PeriodReaderComponent extends Component {

  constructor(public props: PeriodReaderProps) { super() }

  public render = async (): Promise<UIElement> => {
    const period = this.props.period;
    const observationsComponent = await this.props.observationController.getPeriodListComponentAsync(period.id);
    const evaluationsComponent = await this.props.evaluationController.getPeriodListComponentAsync(period.id);
    // Need 
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
      {evaluationsComponent}
      {observationsComponent}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(period)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const PeriodReader = (props: PeriodReaderProps) => new PeriodReaderComponent(props);
