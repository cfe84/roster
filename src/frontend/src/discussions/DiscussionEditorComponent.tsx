import { UIElement, Component } from "../html/index";
import { Discussion } from "./Discussion";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

export type DiscussionEditorAction = "Create" | "Update";

export interface DiscussionEditorProps {
  actionName?: DiscussionEditorAction,
  discussion: Discussion,
  onValidate: ((discussion: Discussion) => void),
  onCancel: (() => void)
}

export class DiscussionEditorComponent extends Component {

  constructor(private props: DiscussionEditorProps) { super() }

  public render = (): UIElement => {
    const discussion = objectUtils.clone(this.props.discussion);
    const saveButtonCaption = `${this.props.actionName || "Create"} discussion`
    const title = `${this.props.actionName || "New discussion"} ${discussion.description}`;
    const prepNotesDraftId = this.props.actionName === "Create" ? "new-discussion-prep-" + this.props.discussion.personId : this.props.discussion.id + "-prep";
    const meetingNotesDraftId = this.props.actionName === "Create" ? "new-discussion-meeting-" + this.props.discussion.personId : this.props.discussion.id + "-meeting";
    const prepNotes: MarkdownInputComponent = <MarkdownInput caption="Prep notes" object={discussion} field="preparation" noteId={prepNotesDraftId} />;
    const meetingNotes: MarkdownInputComponent = <MarkdownInput caption="Meeting notes" object={discussion} field="notes" noteId={meetingNotesDraftId} />;
    const onSave = () => {
      this.props.onValidate(discussion);
      prepNotes.clearDraft();
      meetingNotes.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="comments" onBack={this.props.onCancel} />
      <div class="form-create-element">
        <div class="row">
          <TextInput class="col" caption="Title" object={discussion} field="description" />
          <DateInput class="col-sm" caption="Date" object={discussion} field="date" />
        </div>
        {prepNotes}
        {meetingNotes}
        <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </div>
    </div>;
  }

}

export const DiscussionEditor = (props: DiscussionEditorProps) => new DiscussionEditorComponent(props);
