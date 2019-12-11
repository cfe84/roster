import { UIElement, Component } from "../html/index";
import { dateUtils } from "../utils/dateUtils";
// import MarkdownIt from "markdown-it";
import marked from "marked";
import { GUID } from "../utils/guid";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Discussion } from ".";

interface DiscussionReaderProps {
  discussion: Discussion,
  onEdit: ((discussion: Discussion) => void),
  onBack: (() => void)
}

export class DiscussionReaderComponent extends Component {

  constructor(public props: DiscussionReaderProps) { super() }

  public render = (): UIElement => {
    const discussion = this.props.discussion;
    const markdownDisplay = <MarkdownDisplay
      value={discussion.content}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <h2 class="text-center"><i class="fa fa-sticky-note"></i> {discussion.description}</h2>
      <p class="text-center"><small class="mb-1 ml-auto color-medium">{dateUtils.format(discussion.date)}</small></p>
      {markdownDisplay.render()}
      <button class="btn btn-primary" onclick={() => this.props.onEdit(discussion)}><i class="fa fa-pen"></i> Edit</button>
      &nbsp;<button class="btn btn-secondary" onclick={this.props.onBack}><i class="fa fa-arrow-left"></i> Back</button>
    </div>;
  }

}

export const DiscussionReader = (props: DiscussionReaderProps) => new DiscussionReaderComponent(props);
