import { Exclude, Transform } from "class-transformer"
import { Geometry } from "geojson"
import { User } from "modules/users/entities/user.entity"

export class FarmsResDto {
  @Exclude()
  public id: string

  public name: string

  public address: string

  @Exclude()
  public coordinates: Geometry

  public size: number

  public yield: number

  public drivingDistance: string
  
  @Transform(({ value }) => {
    const farm = value as User
    
    return farm.email
  })
  public owner: User
}
