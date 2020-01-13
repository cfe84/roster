import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { RatingCriteria } from ".";

interface RatingCriteriaReaderProps {
  ratingCriteria: RatingCriteria,
  onEdit: ((ratingCriteria: RatingCriteria) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class RatingCriteriaReaderComponent extends Component {

  constructor(public props: RatingCriteriaReaderProps) { super() }

  public render = (): UIElement => {
    const ratingCriteria = this.props.ratingCriteria;
    const notes = <MarkdownDisplay
      caption="Details"
      value={ratingCriteria.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={ratingCriteria.title} icon="tasks" onBack={this.props.onBack} />
      <div class="row">
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(ratingCriteria)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const RatingCriteriaReader = (props: RatingCriteriaReaderProps) => new RatingCriteriaReaderComponent(props);
