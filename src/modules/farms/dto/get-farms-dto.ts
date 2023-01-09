import { IsBoolean, IsEnum, IsNotEmptyObject, IsObject, IsOptional, IsString } from "class-validator";
import { User } from "modules/users/entities/user.entity";
import { Sort } from "../enums/sort";

export class GetFarmsDto {
  @IsOptional()
  @IsString()
  @IsEnum(Sort)
  public sort: string

  @IsOptional()
  @IsBoolean()
  public outliers: boolean

  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
