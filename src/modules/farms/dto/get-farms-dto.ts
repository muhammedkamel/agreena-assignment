import { IsBoolean, IsIn, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";
import { User } from "modules/users/entities/user.entity";
import { SortFieldMap } from "../enums/sort";

export class GetFarmsDto {
  @IsOptional()
  @IsString()
  @IsIn(Object.values(SortFieldMap).map(key => key.toLocaleLowerCase()))
  public sort: string

  @IsOptional()
  @IsBoolean()
  public outliers: boolean

  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
