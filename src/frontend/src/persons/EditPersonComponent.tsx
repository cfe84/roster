import { UIElement } from "../html/index";

interface EditPersonProps {
  actionName?: string,
  onAddPerson: ((name: string) => void),
  onCancel: (() => void)
}

export const EditPersonComponent = (props: EditPersonProps) => {

  const sendName = (delegate: ((name: string) => void)): (() => void) => {
    return () => {
      const nameInput = document.getElementById("input-name") as HTMLInputElement;
      if (nameInput) {
        delegate(nameInput.value || "");
      }
    }
  }

  return <div class="vertical-center">
    <form class="form-create-element">
      <p class="mb-1">Person's name</p>
      <input class="form-control mb-3" id="input-name" placeholder="Person name"
        type="text"></input>
      <button class="btn btn-primary" onclick={sendName(props.onAddPerson)}>{props.actionName || "Create"} person</button>
      &nbsp;<button class="btn btn-secondary" onclick={props.onCancel}>Cancel</button>
    </form>
  </div>;
}