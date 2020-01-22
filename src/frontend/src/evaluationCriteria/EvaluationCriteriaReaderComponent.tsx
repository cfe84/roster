import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox, Caption } from "../baseComponents";
import { EvaluationCriteria } from ".";
import { GENERIC_CONTROLLER_EVENT_TYPES } from "../baseComponents/GenericController";

interface EvaluationCriteriaReaderProps {
  evaluationCriteria: EvaluationCriteria,
  onEdit: ((evaluationCriteria: EvaluationCriteria) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class EvaluationCriteriaReaderComponent extends Component {

  constructor(public props: EvaluationCriteriaReaderProps) { super() }

  public render = (): UIElement => {
    const evaluationCriteria = this.props.evaluationCriteria;
    const notes = <MarkdownDisplay
      caption="Details"
      value={evaluationCriteria.details}
    ></MarkdownDisplay>;
    const rates = evaluationCriteria.rates.map(
      rate => <tr>
        <th scope="row">{rate.order}</th>
        <td>{rate.name}</td>
        <td>{rate.description}</td>
      </tr>
    );
    return <div class="flex-column">
      <PageTitle title={evaluationCriteria.title} icon="balance-scale-left" onBack={this.props.onBack} />
      {notes.render()}
      <Caption caption="Rates"></Caption>
      <table class="table">
        <thead>
          <tr><th scope="col">Rate</th><th scope="col">Name</th><th scope="col">Description</th></tr>
        </thead>
        <tbody>
          {rates}
        </tbody>
      </table>
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(evaluationCriteria)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }

  public on = (eventType: string, data: any) => {
    if (eventType === GENERIC_CONTROLLER_EVENT_TYPES.ENTITY_UPDATED) {
      this.props.evaluationCriteria = data;
    }
  }
}

export const EvaluationCriteriaReader = (props: EvaluationCriteriaReaderProps) => new EvaluationCriteriaReaderComponent(props);
