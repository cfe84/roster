import { UIElement, IComponent } from "../html/index";

export class SetupPinCodeComponent implements IComponent {
  renderElement(): UIElement {
    return <div class="frontpage text-center">
      <form class="form-signin">
        <p class="mb-5 form-signin__label-moto">Keep up with your team, help them deliver and grow.</p>
        <p class="mb-5 form-signin__label-instructions">To begin, set a PIN code.</p>
        <label for="pin" class="sr-only">Setup a pin code</label>
        <input class="form-control mb-3 form-signin__input-pin" id="pin" placeholder="PIN code"
          type="password"></input>
        <button class="btn btn-lg btn-primary">Get Started</button>
      </form>
    </div>
  }
}