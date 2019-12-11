import { UIElement, Component } from "../html/index";
import { Discussion } from "./Discussion";
import { MarkdownInput, TextInput, DateInput, Button } from "../baseComponents";
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
    return <div>
      <form class="form-create-element">
        <h2 class="text-center"><i class="fa fa-comments"></i> {this.props.actionName || "New discussion"} {this.props.discussion.description}</h2>
        <div class="row">
          <TextInput class="col" caption="Title" object={discussion} field="description" />
          <DateInput class="col-sm" caption="Date" object={discussion} field="date" />
        </div>
        <MarkdownInput caption="Content" object={discussion} field="content" />
        <Button class="mr-2" onclick={() => { this.props.onValidate(discussion) }} icon="save" text={saveButtonCaption} />
        <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
      </form>
    </div>;
  }

}

export const DiscussionEditor = (props: DiscussionEditorProps) => new DiscussionEditorComponent(props);
