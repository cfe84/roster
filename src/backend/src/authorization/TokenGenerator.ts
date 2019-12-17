import { Token } from "../authorization";
import { AES } from "crypto-js"
import CryptoJS from "crypto-js";

export class TokenGenerator {
  constructor(private secret: string, private durationS: number) { }

  createToken(accountId: string): string {
    const expiry = new Date();
    expiry.setMilliseconds(expiry.getMilliseconds() + this.durationS * 1000);
    const token = new Token(accountId, expiry);
    const serializedToken = token.serialize();
    const encrypted = AES.encrypt(serializedToken, this.secret);
    return encrypted.toString();
  }

  validateToken(encryptedToken: string): Token {
    const serializedToken = AES.decrypt(encryptedToken, this.secret).toString(CryptoJS.enc.Utf8);
    const token = Token.deserialize(serializedToken);
    if (token.expiryDate.getTime() < Date.now()) {
      throw (Error("Token expired"));
    } else {
      return token;
    }
  }
}