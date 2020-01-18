import should from "should";
import { dateUtils } from "../src/utils/dateUtils";
import { objectUtils } from "../src/utils/objectUtils";
import * as td from "testdouble";
import { clientIdUtil } from "../src/utils/clientId";

describe("Utils", () => {
  context("Date tools", () => {

    const dates = [
      { input: "Fri Dec 06 2019", expected: "2019-12-06" },
      { input: "Jan 2 2019", expected: "2019-01-02" },
      { input: "Dec 18 2010", expected: "2010-12-18" },
      { input: null, expected: "" },
    ];
    dates.forEach((date) => it(`should print ${date.input} as ${date.expected}`, async () => {
      // given
      const d = date.input ? new Date(date.input) : null;

      // when
      const printed = dateUtils.format(d);

      // then
      should(printed).equal(date.expected);
    }));

    const datesWithTime = [
      { input: "Fri Dec 06 2019 14:26", expected: "2019-12-06 14:26" },
      { input: "Jan 2 2019 3:05", expected: "2019-01-02 03:05" },
      { input: "Dec 18 2010", expected: "2010-12-18 00:00" },
      { input: null, expected: "" },
    ];
    datesWithTime.forEach((date) => it(`should print ${date.input} as ${date.expected}`, async () => {
      // given
      const d = date.input ? new Date(date.input) : null;

      // when
      const printed = dateUtils.formatWithTime(d);

      // then
      should(printed).equal(date.expected);
    }));

    const datesToParse = [
      { input: "2018-12-06", expected: new Date(2018, 11, 6) },
      { input: "2019-01-02", expected: new Date(2019, 0, 2) },
      { input: "", expected: null },
      { input: null, expected: null },
    ];
    datesToParse.forEach((date) => it(`should parse ${date.input} to ${date.expected}`, async () => {
      // given
      const d = dateUtils.parseDate(date.input);

      // then
      should(d).eql(date.expected);
    }));

    const datesToTest = [
      { input: "2017-01-13", expected: true },
      { input: "2018-13-10", expected: false },
      { input: "2018-19", expected: false },
      { input: "2018-01-0", expected: false },
      { input: "2018-01-", expected: false },
      { input: "", expected: true },
    ];
    datesToTest.forEach((date) => it(`should determine that ${date.input} is ${date.expected ? "" : "not "}valid`, () => {
      // given
      const res = dateUtils.isValidDate(date.input);

      // then
      should(res).eql(date.expected);
    }));

    const now = new Date();
    const oneMinuteAgo = new Date(); oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);
    const twoMinutesAgo = new Date(); twoMinutesAgo.setMinutes(twoMinutesAgo.getMinutes() - 2);
    const twoDaysAgo = new Date(); twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const inTwoDays = new Date(); inTwoDays.setDate(inTwoDays.getDate() + 2);
    const timespans = [
      { input: oneMinuteAgo, expected: "a minute ago" },
      { input: twoMinutesAgo, expected: "2 minutes ago" },
      { input: twoDaysAgo, expected: "2 days ago" },
      { input: inTwoDays, expected: "in 2 days" },
    ]
    timespans.forEach((timespan) => it(`should output ${timespan.input} as ${timespan.expected}`, () => {
      // given
      const res = dateUtils.timeSpan(timespan.input);
      // then

      should(res).eql(timespan.expected);
    }));


  });

  context("Object utils", () => {

    const testObjects = [
      { name: "complex objects", object: { id: 1, date: new Date(2018, 12, 1), child: { a: "123", b: null, c: undefined }, obj: "13", num: 1332.1, func: () => { } } },
      { name: "trees", object: { a: { b: { c: [2, 3] } } } },
      { name: "arrays", object: { a: [123, 456], b: [], c: [{ a: 123, b: "bcd" }, { c: 134234, d: undefined }, null] } },
      { name: "null", object: null },
      { name: "undefined", object: undefined }
    ];

    testObjects.forEach(
      obj => it("should clone " + obj.name, () => {
        // given
        const objectToClone = obj.object;
        // when
        const clonedObject = objectUtils.clone(objectToClone);
        // then
        should(clonedObject).deepEqual(objectToClone);
        if (objectToClone) {
          should(clonedObject).not.be.exactly(objectToClone);
        }
      }));

    it("should skip functions if necessary", () => {
      // given
      const input = {
        a: '123',
        func: () => { }
      };

      // when
      const cloned = objectUtils.clone(input, true);

      // then
      should(cloned.a).equal('123');
      should(cloned.func).be.undefined();
    })
  });

  context("ClientID", () => {
    it("should create client id and store it", () => {
      // given
      const fakeLocalStorage = td.object(["getItem", "setItem", "removeItem"]);
      // when
      const id = clientIdUtil.getClientId(fakeLocalStorage);
      // then
      td.verify(fakeLocalStorage.setItem("config.clientid", id));
      should(id.length).be.greaterThan(8);
    });

    it("should get client id from store", () => {
      // given
      const fakeLocalStorage = td.object(["getItem", "setItem", "removeItem"]);
      td.when(fakeLocalStorage.getItem("config.clientid")).thenReturn("12345");
      // when
      const id = clientIdUtil.getClientId(fakeLocalStorage);
      // then
      should(id).equal("12345");
    });
  })
});