import { ResponseAdmin, ResponseUser } from "./response-user";

export interface AuthorizationResponse {
  token: string;
  user: ResponseUser | ResponseAdmin;
}
