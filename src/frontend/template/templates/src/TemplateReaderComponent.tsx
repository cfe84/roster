import { UIElement, Component } from "../html/index";
import { MarkdownDisplay } from "../baseComponents/MarkdownDisplayComponent";
import { Button, PageTitle, DateDisplay, TextDisplay, Checkbox } from "../baseComponents";
import { Template } from ".";
import { GENERIC_CONTROLLER_EVENT_TYPES } from "../baseComponents/GenericController";

interface TemplateReaderProps {
  template: Template,
  onEdit: ((template: Template) => void),
  onDelete: ((template: Template) => void),
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
        <DateDisplay class="col" caption="Date" object={this.props.template} field="date" includeTimespan={true} />
      </div>
      {notes.render()}
      <span class="d-flex">
        <Button type="primary" onclick={() => this.props.onEdit(template)} icon="pen" text="Edit" />
        <Button type="delete" class="ml-auto" onclick={() => this.props.onDelete(template)} icon="trash" text="Delete" />
      </span>
    </div>;
  }

  public on = (eventType: string, data: any) => {
    if (eventType === GENERIC_CONTROLLER_EVENT_TYPES.ENTITY_UPDATED) {
      this.props.template = data;
    }
  }
}

export const TemplateReader = (props: TemplateReaderProps) => new TemplateReaderComponent(props);
