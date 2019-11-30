import { EditPersonComponent, ListPeopleComponent } from "./index";
import { UI } from "../html/UI";
import { UIElement } from "../html";

export class PeopleController {
  async loadPeopleListAsync(): Promise<void> {
    const people = [{ name: "Paul", id: "1" },
    { name: "Pierre", id: "2" },
    { name: "Peter", id: "3" }
    ];
    const component = <ListPeopleComponent
      people={people}
      onAddPersonClicked={this.loadCreatePerson}></ListPeopleComponent>
      ;
    UI.render(component);
  }

  loadCreatePerson(): void {
    const component = <EditPersonComponent actionName="Create"></EditPersonComponent>;
    UI.render(component);
  }
}