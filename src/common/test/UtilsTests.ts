import should from "should";
import { AsyncTimeout } from "../src/utils/AsyncTimeout";

describe("Utils", () => {
  context("AsyncTimeout", () => {
    it("should handle return after set time", async () => {
      // given
      const t = new AsyncTimeout();
      const start = new Date();
      let running = false;

      // when
      setTimeout(() => running = t.isRunning(), 10);
      await t.sleepAsync(100);

      // then
      const finish = new Date();
      should(finish.getTime() - start.getTime()).within(99, 120);
      should(running).be.true();
    });

    it("should return from waiting when aborting", async () => {

      // given
      const t = new AsyncTimeout();
      const start = new Date();

      // when
      setTimeout(() => t.abort(), 100);
      await t.sleepAsync(1000);

      // then
      const finish = new Date();
      should(finish.getTime() - start.getTime()).within(99, 120);
    })
  })
});