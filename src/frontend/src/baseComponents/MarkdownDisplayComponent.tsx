import { Component, UIElement } from "../html";
import marked from "marked";
import { GUID } from "../utils/guid";
import { Caption } from ".";

export interface MarkdownDisplayProps {
  caption?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: string
}

export class MarkdownDisplayComponent extends Component {
  constructor(private props: MarkdownDisplayProps) {
    super();
  }

  render = (): UIElement => {
    const content = this.props.value || "";
    const parsedNote = marked(content);
    const noteId = `content-${GUID.newGuid()}`;
    const script = `document.getElementById("${noteId}").innerHTML = "${parsedNote.replace(/"/gm, '\\"').replace(/\n/gm, "\\\n")}";`
    const caption = <Caption caption={this.props.caption}></Caption>;
    const component = <div>
      {caption.render()}
      <p class="mb-1 display-markdown" id={noteId}>Loading. You shouldn't see this, this is a very bad sign.</p>
      <script>{script}</script>
    </div>
    return component;
  }
}

export const MarkdownDisplay = (props: MarkdownDisplayProps) => new MarkdownDisplayComponent(props);