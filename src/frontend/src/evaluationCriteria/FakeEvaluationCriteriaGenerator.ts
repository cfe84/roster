import { IFakeGenerator } from "../storage/IFakeGenerator";
import { EventBus } from "../../lib/common/events";
import { EvaluationCriteria } from ".";
import { EvaluationCriteriaCreatedEvent } from "./EvaluationCriteriaEvents";
import { generateContent, generateTitle } from "../utils/fakeContent";
import { Rate } from "./EvaluationCriteria";
import { GUID } from "../../lib/common/utils/guid";
import { pick } from "../utils/pick";

const actions = [
  "killing", "murdering", "slaughtering", "enslaving", "dominating", "lashing", "evicerating",
  "dismembering", "beheading", "reaping", "bashing", "hitting", "castrating"
];
const subjects = [
  "humans", "souls", "people", "men", "folks", "children", "dogs", "ants"
]
const beforeSkills = ["skilled at", "capacity at", "adequacy at", "excellency at"]
const afterSkills = ["skills", "capacity", "performance", "adequacy"];
const skills = beforeSkills.map(skill => ({ where: "before", skill })).concat(afterSkills.map((skill) => ({ where: "after", skill })));

const selectSubject = () => pick(subjects);
const selectAction = (subject: string) => `${pick(actions)} ${subject}`;
const selectSkill = (action: string) => {
  const skill = pick(skills) as any;
  if (skill.where === "before") {
    return `${skill.skill} ${action}`;
  } else {
    return `${action} ${skill.skill}`
  }
}

const badRates = ["terrible", "the worst", "horrendous", "shameful", "sad"];
const mediumRates = ["passable", "mediocre", "ok", "could be worse", "meh", "lemon"];
const goodRates = ["excellent", "good", "godlike", "yep yep yep", "a reference", "yeaaaah"]

export class FakeEvaluationCriteriaGenerator implements IFakeGenerator {
  constructor() { }

  async generateAsync(eventBus: EventBus): Promise<void> {
    const evaluationCriteria: EvaluationCriteria = new EvaluationCriteria();
    evaluationCriteria.details = generateContent(2 + Math.floor(Math.random() * 4));
    evaluationCriteria.title = selectSkill(selectAction(selectSubject()));
    const rates: Rate[] = [];
    let order = 0;
    [badRates, mediumRates, goodRates].forEach((rateList) => {
      for (let i = 0; i < Math.random() * 2 + 1; i++) {
        rates.push({
          description: generateContent(1, 10, false), name: pick(rateList), order: order++, id: GUID.newGuid()
        })
      }
    });

    evaluationCriteria.rates = rates;
    await eventBus.publishAsync(new EvaluationCriteriaCreatedEvent(evaluationCriteria));
  }
}