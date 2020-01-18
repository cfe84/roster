import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Observation } from ".";

interface ObservationReaderProps {
  observation: Observation,
  onEdit: ((observation: Observation) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class ObservationReaderComponent extends Component {

  constructor(public props: ObservationReaderProps) { super() }

  public render = (): UIElement => {
    const observation = this.props.observation;
    const notes = <MarkdownDisplay
      caption="Details"
      value={observation.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={observation.title} icon="tasks" onBack={this.props.onBack} />
      <div class="row">
        <DateDisplay class="col" caption="Date" object={this.props.observation} field="date" includeTimespan={true} />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(observation)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const ObservationReader = (props: ObservationReaderProps) => new ObservationReaderComponent(props);
