import { INotesStore } from "../notes/INotesStore";
import { IDiscussionStore } from "../discussions/IDiscussionStore";
import { IDeadlineStore } from "../deadlines/IDeadlineStore";
import { IPersonStore } from "../persons";

export interface IWholeStore extends IPersonStore, INotesStore, IDiscussionStore, IDeadlineStore {

}