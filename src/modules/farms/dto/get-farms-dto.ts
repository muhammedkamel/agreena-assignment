import { IsNotEmptyObject, IsObject } from "class-validator";
import { User } from "modules/users/entities/user.entity";

export class GetFarmsDto {
  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
