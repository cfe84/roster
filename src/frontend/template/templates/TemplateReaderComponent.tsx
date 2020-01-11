import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Template } from ".";

interface TemplateReaderProps {
  template: Template,
  onCompleteChanged: (value: boolean) => void,
  onEdit: ((template: Template) => void),
  onDelete: (() => void),
  onBack: (() => void)
}

export class TemplateReaderComponent extends Component {

  constructor(public props: TemplateReaderProps) { super() }

  public render = (): UIElement => {
    const template = this.props.template;
    const notes = <MarkdownDisplay
      caption="Details"
      value={template.details}
    ></MarkdownDisplay>;
    return <div class="flex-column">
      <PageTitle title={template.title} icon="tasks" onBack={this.props.onBack} />
      <div class="row">
        <TextDisplay class="col" caption="Responsibility" object={this.props.template} field="responsibility" />
        <DateDisplay class="col" caption="Due date" object={this.props.template} field="dueDate" includeTimespan={true} />
        <Checkbox class="col" caption="Completed" object={this.props.template} field="completed" onchange={this.props.onCompleteChanged} />
        <DateDisplay class="col" caption="Completion date" object={this.props.template} field="completionDate" />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(template)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={this.props.onDelete} icon="trash" text="Delete" />
      </span>
    </div>;
  }
}

export const TemplateReader = (props: TemplateReaderProps) => new TemplateReaderComponent(props);
