import { ICredentialsProvider } from "../authorization/ICredentialsProvider";
import { JsonSerializer } from "../../lib/common/utils/JsonSerializer";

interface CredentialObject {
  [username: string]: string;
}

export class EnvironmentCredentialsProvider implements ICredentialsProvider {
  constructor(private credentials?: CredentialObject) {
    if (!credentials) {
      credentials = JsonSerializer.deserialize(process.env.USERS as any);
    }
  }
  validateCredentials(username: string, password: string): boolean {
    return !!this.credentials &&
      !!this.credentials[username] &&
      password === this.credentials[username];
  }

}