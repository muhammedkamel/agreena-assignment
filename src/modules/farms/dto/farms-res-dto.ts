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

  @Transform(({value}) => `${(value / 10**6).toFixed(3)} km`)
  public drivingDistance: number
  
  @Transform(({ value }) => {
    const farm = value as User
    
    return farm.email
  })
  public owner: User
}
