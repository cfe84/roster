import { UIElement, Component } from "../html/index";
import { dateUtils } from "../utils/dateUtils";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Deadline } from ".";
import { Button, PageTitle } from "../baseComponents";

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
      <PageTitle title={deadline.description} icon="calendar-day" onBack={this.props.onBack} />
      <h1 class="text-center color-primary">{dateUtils.format(deadline.deadline)}</h1>
      <p class="text-center color-primary">{dateUtils.timeSpan(deadline.deadline)}</p>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={this.props.onEdit} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const DeadlineReader = (props: DeadlineReaderProps) => new DeadlineReaderComponent(props);
