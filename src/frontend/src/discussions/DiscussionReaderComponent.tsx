import { UIElement, Component } from "../html/index";
import { dateUtils } from "../utils/dateUtils";
// import MarkdownIt from "markdown-it";
import marked from "marked";
import { GUID } from "../../lib/common/utils/guid";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Discussion } from ".";
import { Button, PageTitle } from "../baseComponents";

interface DiscussionReaderProps {
  discussion: Discussion,
  onEdit: ((discussion: Discussion) => void),
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
      <PageTitle title={discussion.description} icon="comments" onBack={this.props.onBack} />
      <p class="text-center"><small class="mb-1 ml-auto color-medium">{dateUtils.format(discussion.date)}</small></p>
      {preparationMarkdownDisplay.render()}
      {meetingNotesMarkdownDisplay.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(discussion)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const DiscussionReader = (props: DiscussionReaderProps) => new DiscussionReaderComponent(props);
