import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { EvaluationCriteria } from ".";

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
    return <div class="flex-column">
      <PageTitle title={evaluationCriteria.title} icon="tasks" onBack={this.props.onBack} />
      <div class="row">
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(evaluationCriteria)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const EvaluationCriteriaReader = (props: EvaluationCriteriaReaderProps) => new EvaluationCriteriaReaderComponent(props);
