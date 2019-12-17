import should from "should";
import { AsyncTimeout } from "../src/utils/AsyncTimeout";
import { base64 } from "../src/utils/base64";

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
    });

    it("Encodes in base64", () => {
      should(base64.btoa('')).eql('');
      should(base64.btoa('f')).eql('Zg==');
      should(base64.btoa('fo')).eql('Zm8=');
      should(base64.btoa('foo')).eql('Zm9v');
      should(base64.btoa('quux')).eql('cXV1eA==');
      should(base64.btoa('!"#$%')).eql('ISIjJCU=');
      should(base64.btoa("&'()*+")).eql('JicoKSor');
      should(base64.btoa(',-./012')).eql('LC0uLzAxMg==');
      should(base64.btoa('3456789:')).eql('MzQ1Njc4OTo=');
      should(base64.btoa(';<=>?@ABC')).eql('Ozw9Pj9AQUJD');
      should(base64.btoa('DEFGHIJKLM')).eql('REVGR0hJSktMTQ==');
      should(base64.btoa('NOPQRSTUVWX')).eql('Tk9QUVJTVFVWV1g=');
      should(base64.btoa('YZ[\\]^_`abc')).eql('WVpbXF1eX2BhYmM=');
      should(base64.btoa('defghijklmnop')).eql('ZGVmZ2hpamtsbW5vcA==');
      should(base64.btoa('qrstuvwxyz{|}~')).eql('cXJzdHV2d3h5ent8fX4=');
    });

    it('can decode Base64-encoded input', function () {
      should(base64.atob('')).eql('');
      should(base64.atob('Zg==')).eql('f');
      should(base64.atob('Zm8=')).eql('fo');
      should(base64.atob('Zm9v')).eql('foo');
      should(base64.atob('cXV1eA==')).eql('quux');
      should(base64.atob('ISIjJCU=')).eql('!"#$%');
      should(base64.atob('JicoKSor')).eql("&'()*+");
      should(base64.atob('LC0uLzAxMg==')).eql(',-./012');
      should(base64.atob('MzQ1Njc4OTo=')).eql('3456789:');
      should(base64.atob('Ozw9Pj9AQUJD')).eql(';<=>?@ABC');
      should(base64.atob('REVGR0hJSktMTQ==')).eql('DEFGHIJKLM');
      should(base64.atob('Tk9QUVJTVFVWV1g=')).eql('NOPQRSTUVWX');
      should(base64.atob('WVpbXF1eX2BhYmM=')).eql('YZ[\\]^_`abc');
      should(base64.atob('ZGVmZ2hpamtsbW5vcA==')).eql('defghijklmnop');
      should(base64.atob('cXJzdHV2d3h5ent8fX4=')).eql('qrstuvwxyz{|}~');
    });
  })
});