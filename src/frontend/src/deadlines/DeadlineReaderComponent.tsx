import { UIElement, Component } from "../html/index";
import { dateUtils } from "../utils/dateUtils";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Deadline } from ".";
import { Button } from "../baseComponents";

interface DeadlineReaderProps {
  deadline: Deadline,
  onEdit: (() => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class DeadlineReaderComponent extends Component {

  constructor(public props: DeadlineReaderProps) { super() }

  public render = (): UIElement => {
    const deadline = this.props.deadline;
    const notes = <MarkdownDisplay
      caption="Notes"
      value={deadline.notes}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <h2 class="text-center"><i class="fa fa-calendar-day"></i> {deadline.description}</h2>
      <h1 class="text-center color-primary">{dateUtils.format(deadline.deadline)}</h1>
      <p class="text-center color-primary">{dateUtils.timeSpan(deadline.deadline)}</p>
      {notes.render()}
      <span class="d-flex">
        <Button class="mr-2" type="primary" onclick={this.props.onEdit} icon="pen" text="Edit" />
        <Button type="secondary" onclick={this.props.onBack} icon="arrow-left" text="Back" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const DeadlineReader = (props: DeadlineReaderProps) => new DeadlineReaderComponent(props);
