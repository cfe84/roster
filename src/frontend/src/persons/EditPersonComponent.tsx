import { UIElement } from "../html/index";

export const EditPersonComponent = (props: { actionName?: string }) =>
  <div class="vertical-center">
    <form class="form-create-element">
      <p class="mb-1">Person's name</p>
      <label for="pin" class="sr-only">Setup a pin code</label>
      <input class="form-control mb-3" id="pin" placeholder="Person name"
        type="text"></input>
      <button class="btn btn-primary">{props.actionName || "Create"} person</button>
      &nbsp;<button class="btn btn-secondary">Cancel</button>
    </form>
  </div>;

