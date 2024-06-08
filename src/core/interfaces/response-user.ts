import { UserEntity } from "../../entities/user.entity";

export type ResponseUser = Omit<UserEntity, "password" | "hashPassword">;
export type ResponseAdmin = Omit<
  UserEntity,
  "password" | "hashPassword" | "fbId"
>;
