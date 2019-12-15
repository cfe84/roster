import { JsonSerializer } from "../utils/JsonSerializer";
const base64 = require("base64");

export class Token {
  constructor(public accountId: string = "9ee23e8b-b8b2-492b-bccf-ebf56f53c35d") { }

  static deserialize(serializedToken: string): Token {
    const jsonSerialized = base64.atob(serializedToken);
    const parsed = JsonSerializer.deserialize(jsonSerialized) as Token;
    return new Token(parsed.accountId);
  }

  serialize(): string {
    return base64.btoa(JsonSerializer.serialize(this));
  }
}