import { INotesStore } from "../notes/INotesStore";
import { IDiscussionStore } from "../discussions/IDiscussionStore";
import { IDeadlineStore } from "../deadlines/IDeadlineStore";
import { IPersonStore } from "../persons";
import { IActionStore } from "../actions";
import { IPeriodStore } from "../period";
import { IEvaluationCriteriaStore } from "../evaluationCriteria";

export interface IWholeStore extends IPersonStore, INotesStore, IDiscussionStore, IDeadlineStore, IActionStore, IPeriodStore, IEvaluationCriteriaStore {

}