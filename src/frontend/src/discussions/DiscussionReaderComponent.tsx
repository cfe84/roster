import { UIElement, Component } from "../html/index";
import { dateUtils } from "../utils/dateUtils";
// import MarkdownIt from "markdown-it";
import marked from "marked";
import { GUID } from "../utils/guid";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Discussion } from ".";
import { Button } from "../baseComponents";

interface DiscussionReaderProps {
  discussion: Discussion,
  onEdit: (() => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class DiscussionReaderComponent extends Component {

  constructor(public props: DiscussionReaderProps) { super() }

  public render = (): UIElement => {
    const discussion = this.props.discussion;
    const preparationMarkdownDisplay = <MarkdownDisplay
      caption="Prep notes"
      value={discussion.preparation}
    ></MarkdownDisplay>;
    const meetingNotesMarkdownDisplay = <MarkdownDisplay
      caption="Meeting notes"
      value={discussion.notes}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <h2 class="text-center"><i class="fa fa-sticky-note"></i> {discussion.description}</h2>
      <p class="text-center"><small class="mb-1 ml-auto color-medium">{dateUtils.format(discussion.date)}</small></p>
      {preparationMarkdownDisplay.render()}
      {meetingNotesMarkdownDisplay.render()}
      <span class="d-flex">
        <Button class="mr-2" type="primary" onclick={this.props.onEdit} icon="pen" text="Edit" />
        <Button type="secondary" onclick={this.props.onBack} icon="arrow-left" text="Back" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const DiscussionReader = (props: DiscussionReaderProps) => new DiscussionReaderComponent(props);
