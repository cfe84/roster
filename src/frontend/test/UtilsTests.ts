import should from "should";
import { dateUtils } from "../src/utils/dateUtils";

describe("Utils", () => {
  context("Date tools", () => {

    const dates = [
      { input: "Fri Dec 06 2019", expected: "2019-12-06" },
      { input: "Jan 2 2019", expected: "2019-01-02" },
      { input: "Dec 18 2010", expected: "2010-12-18" },
    ];
    dates.forEach((date) => it(`should print ${date.input} as ${date.expected}`, async () => {
      // given
      const d = new Date(date.input);

      // when
      const printed = dateUtils.format(d);

      // then
      should(printed).equal(date.expected);
    }));
  });
});