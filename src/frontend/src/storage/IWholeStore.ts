import { INotesStore } from "../notes/INotesStore";
import { IDiscussionStore } from "../discussions/IDiscussionStore";
import { IDeadlineStore } from "../deadlines/IDeadlineStore";
import { IPersonStore } from "../persons";
import { IActionStore } from "../actions";
import { IPeriodStore } from "../period";

export interface IWholeStore extends IPersonStore, INotesStore, IDiscussionStore, IDeadlineStore, IActionStore, IPeriodStore {

}