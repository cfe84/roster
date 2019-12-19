import { IConfigurationProvider } from "../IConfigurationProvider";

export class EnvironmentConfigurationProvider implements IConfigurationProvider {
  getTokenSecret(): string {
    return process.env.TOKEN_SECRET as string;
  }
}