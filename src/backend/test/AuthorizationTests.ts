import { Token } from "../src/authorization"
import should from "should";
import { TokenGenerator } from "../src/authorization/TokenGenerator";
import { EnvironmentCredentialsProvider } from "../src/infrastructure/EnvironmentCredentialsProvider";

describe("Authorization", () => {
  it("should serialize/deserialize properly", () => {
    // given
    const token = new Token("account-id-1", new Date());

    // when
    const serialized = token.serialize();
    const deserialized = Token.deserialize(serialized);

    // then
    should(deserialized).be.deepEqual(token);
  })

  it("should validate tokens", (done) => {
    // given
    const tokenGenerator = new TokenGenerator("sdlfksfgjeoifivmaodiscmv", .1);
    const accountId = "odifowkfw";
    const start = new Date();
    const end = new Date();
    end.setMilliseconds(end.getMilliseconds() + 200);

    // when
    const cryptoToken = tokenGenerator.createToken(accountId);

    // then
    const token = tokenGenerator.validateToken(cryptoToken);
    should(token.expiryDate.getTime()).within(start.getTime(), end.getTime());
    setTimeout(() => {
      should(() => tokenGenerator.validateToken(cryptoToken)).throw();
      done();
    }, 110)
  });

  it("should validate users from env", () => {
    // given
    const envCredProvider = new EnvironmentCredentialsProvider({
      "rick": "1234"
    });

    // when
    should(envCredProvider.validateCredentials("rick", "1234")).be.true();
    should(envCredProvider.validateCredentials("rick", "werw")).be.false();
    should(envCredProvider.validateCredentials("werw", "1234")).be.false();
  })
})