import { EditPersonComponent, ListPeopleComponent } from "./index";
import { UI } from "../html/UI";
import { UIElement } from "../html";
import { EventBus } from "../events";
import { PersonCreatedEvent } from "./PersonCreatedEvent";

export class PeopleController {
  constructor(private eventBus: EventBus) {
  }
  public loadPeopleListAsync = async (): Promise<void> => {
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

  public loadCreatePerson = (): void => {
    const addPerson = (name: string): boolean => {
      this.eventBus.publishAsync(new PersonCreatedEvent(name))
        .then(() => this.loadPeopleListAsync());
      return false;
    }
    const cancel = (): boolean => {
      this.loadPeopleListAsync().then();
      return false;
    };
    const component = <EditPersonComponent actionName="Create"
      onCancel={cancel}
      onAddPerson={addPerson}
    >
    </EditPersonComponent>;
    UI.render(component);
  }
}