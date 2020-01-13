import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { RatingCriteria } from ".";

interface RatingCriteriaEditorProps {
  ratingCriteriaName: ActionType,
  ratingCriteria: RatingCriteria,
  onValidate: ((ratingCriteria: RatingCriteria) => void),
  onCancel: (() => void)
}

export class RatingCriteriaEditorComponent extends Component {

  constructor(private props: RatingCriteriaEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const ratingCriteria: RatingCriteria = objectUtils.clone(this.props.ratingCriteria);
    const saveButtonCaption = `${this.props.ratingCriteriaName || "Create"} ratingCriteria`
    const draftId = this.props.ratingCriteriaName === "Create" ? "new-ratingCriteria-" + this.props.ratingCriteria : this.props.ratingCriteria.id;
    const title = `${this.props.ratingCriteriaName || "New ratingCriteria"} ${ratingCriteria.title}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={ratingCriteria} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(ratingCriteria);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={ratingCriteria} field="title" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const RatingCriteriaEditor = (props: RatingCriteriaEditorProps) => new RatingCriteriaEditorComponent(props);
