import { UIElement, Component } from "../html/index";
import { Discussion } from "./Discussion";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";

interface DiscussionEditorProps {
  actionName?: string,
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
    return <div>
      <PageTitle title={title} icon="comments" onBack={this.props.onCancel} />
      <form class="form-create-element">
        <div class="row">
          <TextInput class="col" caption="Title" object={discussion} field="description" />
          <DateInput class="col-sm" caption="Date" object={discussion} field="date" />
        </div>
        <MarkdownInput caption="Prep notes" object={discussion} field="preparation" />
        <MarkdownInput caption="Meeting notes" object={discussion} field="notes" />
        <Button class="mr-2" onclick={() => { this.props.onValidate(discussion) }} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </form>
    </div>;
  }

}

export const DiscussionEditor = (props: DiscussionEditorProps) => new DiscussionEditorComponent(props);
