import { EditPersonComponent, ListPeopleComponent } from "./index";
import { UI } from "../html/UI";

export class PeopleController {
  async loadPeopleListAsync(): Promise<void> {
    const component = ListPeopleComponent({
      people: [
        { name: "Paul", id: "1" },
        { name: "Pierre", id: "2" },
        { name: "Peter", id: "3" }
      ]
    });
    UI.render(component);
  }
}