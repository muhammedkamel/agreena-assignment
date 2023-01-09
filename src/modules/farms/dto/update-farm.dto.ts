import { IsEmpty, IsNotEmpty, IsNotEmptyObject, IsNumber, IsObject, IsOptional, IsString, IsUUID, ValidateIf } from "class-validator";
import { Point } from "geojson";
import { User } from "modules/users/entities/user.entity";

export class UpdateFarmDto {
  @IsUUID()
  @IsNotEmpty()
  public id: string

  @ValidateIf((o):boolean => {
    const updateFarmDto = o as UpdateFarmDto
    return Boolean(updateFarmDto.address || updateFarmDto.coordinates || updateFarmDto.size || updateFarmDto.yield)
  })
  @IsString()
  @IsNotEmpty()
  public name: string;

  @ValidateIf((o):boolean => {
    const updateFarmDto = o as UpdateFarmDto
    return Boolean(updateFarmDto.name || updateFarmDto.coordinates || updateFarmDto.size || updateFarmDto.yield)
  })
  @IsString()
  @IsNotEmpty()
  public address: string

  @ValidateIf((o):boolean => {
    const updateFarmDto = o as UpdateFarmDto
    return Boolean(updateFarmDto.name || updateFarmDto.address || updateFarmDto.size || updateFarmDto.yield)
  })
  @IsEmpty()
  @IsOptional()
  public coordinates: Point;

  @ValidateIf((o):boolean => {
    const updateFarmDto = o as UpdateFarmDto
    return Boolean(updateFarmDto.name || updateFarmDto.coordinates || updateFarmDto.address || updateFarmDto.yield)
  })
  @IsNumber()
  @IsNotEmpty()
  public size: number;

  @ValidateIf((o):boolean => {
    const updateFarmDto = o as UpdateFarmDto
    return Boolean(updateFarmDto.name || updateFarmDto.coordinates || updateFarmDto.size || updateFarmDto.address)
  })
  @IsNumber()
  @IsNotEmpty()
  public yield: number;

  @IsObject()
  @IsNotEmptyObject()
  public user: User
}
