import { IsNotEmpty, IsNotEmptyObject, IsObject, IsUUID } from "class-validator";
import { User } from "modules/users/entities/user.entity";

export class DeleteFarmDto {
  @IsUUID()
  @IsNotEmpty()
  public id: string

  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
