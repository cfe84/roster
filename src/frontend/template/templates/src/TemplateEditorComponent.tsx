import { UIElement, Component } from "../html/index";
import { MarkdownInput, TextInput, DateInput, Button, PageTitle, MarkdownInputComponent, Select, Checkbox } from "../baseComponents";
import { objectUtils } from "../utils/objectUtils";
import { ActionType } from "../baseComponents/ActionType";
import { Template } from ".";

interface TemplateEditorProps {
  actionName: ActionType,
  template: Template,
  onValidate: ((template: Template) => void),
  onCancel: (() => void)
}

export class TemplateEditorComponent extends Component {

  constructor(private props: TemplateEditorProps) {
    super()
  }

  public render = (): UIElement => {
    const template: Template = objectUtils.clone(this.props.template);
    const saveButtonCaption = `${this.props.actionName || "Create"} template`
    const draftId = this.props.actionName === "Create" ? "new-template-" + this.props.template.personId : this.props.template.id;
    const title = `${this.props.actionName} ${template.title || "new template"}`;
    const editor: MarkdownInputComponent = <MarkdownInput caption="Description" object={template} field="details" noteId={draftId} />
    const onSave = () => {
      this.props.onValidate(template);
      editor.clearDraft();
    };
    return <div>
      <PageTitle title={title} icon="tasks" onBack={this.props.onCancel} />
      <div class="row">
        <TextInput class="col" caption="Title" object={template} field="title" />
        <DateInput class="col" caption="Date" object={template} field="date" />
      </div>
      {editor}
      <Button class="mr-2" onclick={onSave} icon="save" text={saveButtonCaption} />
      <Button type="secondary" onclick={this.props.onCancel} icon="times" text="Cancel" />
    </div>;
  }

}

export const TemplateEditor = (props: TemplateEditorProps) => new TemplateEditorComponent(props);
