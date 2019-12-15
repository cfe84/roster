import { Token } from "../src/authorization"
import should from "should";

describe("Authorization", () => {
  it("should serialize/deserialize properly", () => {
    // given
    const token = new Token("account-id-1");

    // when
    const serialized = token.serialize();
    const deserialized = Token.deserialize(serialized);

    // then
    should(deserialized).be.deepEqual(token);
  })
})