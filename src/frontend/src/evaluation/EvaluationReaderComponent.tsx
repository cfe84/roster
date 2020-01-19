import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Evaluation } from ".";

interface EvaluationReaderProps {
  evaluation: Evaluation,
  onEdit: ((evaluation: Evaluation) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class EvaluationReaderComponent extends Component {

  constructor(public props: EvaluationReaderProps) { super() }

  public render = (): UIElement => {
    const evaluation = this.props.evaluation;
    const notes = <MarkdownDisplay
      caption="Details"
      value={evaluation.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={evaluation.title} icon="ruler" onBack={this.props.onBack} />
      <div class="row">
        <DateDisplay class="col" caption="Date" object={this.props.evaluation} field="date" includeTimespan={true} />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(evaluation)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const EvaluationReader = (props: EvaluationReaderProps) => new EvaluationReaderComponent(props);
