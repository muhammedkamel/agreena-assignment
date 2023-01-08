import { IsEmpty, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString } from "class-validator";
import { Point } from "geojson";
import { User } from "modules/users/entities/user.entity";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public address: string

  @IsEmpty()
  @IsOptional()
  public coordinates: Point;

  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @IsNumber()
  @IsNotEmpty()
  public yield: number;

  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
