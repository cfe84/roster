import { GUID } from "../../lib/common/utils/guid";
import { ILocalStorage } from "../storage/ILocalStorage";

const CLIENT_ID_KEY = "config.clientid";

export class clientIdUtil {
  static getClientId = (storage: ILocalStorage = localStorage): string =>
    storage.getItem(CLIENT_ID_KEY) || clientIdUtil.createClientId(storage)

  private static createClientId(storage: ILocalStorage): string {
    const clientId = GUID.newGuid();
    storage.setItem(CLIENT_ID_KEY, clientId);
    return clientId;
  }
}