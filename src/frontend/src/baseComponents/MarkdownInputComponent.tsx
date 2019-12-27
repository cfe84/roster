import { Component, UIElement } from "../html";
import { GUID } from "../../lib/common/utils/guid";
import { Caption } from ".";

export interface MarkdownInputProps {
  caption?: string,
  id?: string,
  onchange?: ((newValue: string) => void),
  placeholder?: string,
  object?: object,
  field?: string,
  class?: string,
  value?: string,
  noteId?: string
}

type onChangeDelegate = (val: string) => void;

const BASE_KEY = "markdown.draft-";

export class MarkdownInputComponent extends Component {
  draftKey: string;
  constructor(private props: MarkdownInputProps) {
    super();
    this.draftKey = props.noteId ? BASE_KEY + props.noteId : "";
  }

  clearDraft = () => {
    localStorage.removeItem(this.draftKey);
  }

  saveDraft = (value: string) => {
    localStorage.setItem(this.draftKey, value);
  }

  draftExists = (): boolean => !!localStorage.getItem(this.draftKey);

  openDraft = (componentId: string) => {
    const component = document.getElementById(componentId);
    const content = localStorage.getItem(this.draftKey);
    if (component && content) {
      component.innerHTML = content;
    }
  }

  getOnChange = (onchange?: onChangeDelegate, object?: object, field?: string): onChangeDelegate => {
    if (onchange && object && field) {
      return (evt: any) => {
        const val = evt.target.value;
        this.saveDraft(val);
        (object as any)[field] = val;
        onchange(val);
      }
    } else if (onchange) {
      return (evt: any) => {
        this.saveDraft(evt.target.value);
        onchange(evt.target.value);
      }
    } else if (object && field) {
      return (evt: any) => {
        this.saveDraft(evt.target.value);
        (object as any)[field] = evt.target.value;
      }
    } else {
      return (evt: any) => {
        this.saveDraft(evt.target.value);
      }
    }
  }

  removeDraftLink = (linkId: string) => {
    const component = document.getElementById(linkId);
    if (component) {
      component.innerHTML = "";
    }
  }

  render = (): UIElement => {
    const value = this.props.value || ((this.props.object && this.props.field) ? (this.props.object as any)[this.props.field] : "");
    const componentId = this.props.id || `input-${GUID.newGuid()}`;
    const onchange = this.getOnChange(this.props.onchange, this.props.object, this.props.field);
    const caption = this.props.caption ? <Caption caption={this.props.caption} /> : "";
    const draft = this.draftExists();
    const linkId = GUID.newGuid();
    const openDraft = () => {
      this.removeDraftLink(linkId)
      this.openDraft(componentId);
    }
    const removeLink = () => {
      this.removeDraftLink(linkId)
      this.clearDraft();
    }
    const draftLink = (draft && this.draftKey) ? <span id={linkId}>A draft exists. <a href="#" onclick={openDraft}>Click here to load it</a> and <a href="#" onclick={removeLink}>here to discard it.</a></span> : ""
    const component = <div class={this.props.class || ""}>
      {caption}
      <textarea class="form-control mb-3 input-markdown"
        onkeyup={onchange}
        onchange={onchange}
        id={componentId}
        placeholder={this.props.placeholder || this.props.caption || ""}
      >{value}</textarea>
      {draftLink}
    </div>
    return component;
  }
}

export const MarkdownInput = (props: MarkdownInputProps) => new MarkdownInputComponent(props);