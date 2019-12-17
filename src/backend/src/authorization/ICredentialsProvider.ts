export type AccountId = string;

export interface ICredentialsProvider {
  // createCredentials(username: string, password: string): AccountId;
  validateCredentials(username: string, password: string): void;
}