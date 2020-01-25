import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";
import { base64 } from "../../lib/common/utils/base64";

export class Token {
  constructor(public accountId: string, public expiryDate: Date) { }

  static deserialize(serializedToken: string): Token {
    const jsonSerialized = base64.atob(serializedToken);
    const parsed = JsonSerializer.deserialize(jsonSerialized) as Token;
    return new Token(parsed.accountId, parsed.expiryDate);
  }

  serialize(): string {
    return base64.btoa(JsonSerializer.serialize(this));
  }
}