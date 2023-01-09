import { DeepPartial, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { GoogleMapService } from "helpers/google-maps-services";
import { Point } from "geojson";
import { ResourceNotFoundError } from "errors/errors";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { GetFarmsDto } from "./dto/get-farms-dto";
import { LatLng } from "@googlemaps/google-maps-services-js";
import { FarmsResDto } from "./dto/farms-res-dto";
import { plainToInstance } from "class-transformer";

export class FarmsService {
  private readonly farmsRepo: Repository<Farm>;

  constructor() {
    this.farmsRepo = dataSource.getRepository(Farm);
  }

  // @todo Should handle farm duplication
  public async createFarm(data: CreateFarmDto): Promise<Farm> {
    const { name, address, coordinates, size, yield: field, user } = data;

    const farmData: DeepPartial<Farm> = { name, address, coordinates, size, yield: field, user };

    const newFarm = this.farmsRepo.create(farmData);

    return this.farmsRepo.save(newFarm);
  }

  public async updateFarm(updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findUserFarmById(updateFarmDto)

    if(!farm) throw new ResourceNotFoundError("Farm is not exists")

    if(updateFarmDto.address && updateFarmDto.address !== farm.address) {
      const { geometry: { location } } = await GoogleMapService.geocode(updateFarmDto.address)
      updateFarmDto.coordinates = { coordinates: [location.lng, location.lat] } as Point
    }

    Object.assign(farm, updateFarmDto)

    return this.farmsRepo.save(farm)
  }

  public async findUserFarmById(data: UpdateFarmDto | DeleteFarmDto): Promise<Farm | null> {
    return this.farmsRepo.findOne({
      relations: ["user"],
      where: {
        id: data.id,
        user: {
          id: data.user.id
        }
      }
    })
  }

  public async deleteFarm(deleteFarmDto: DeleteFarmDto): Promise<void> {
    const farm = await this.findUserFarmById(deleteFarmDto)

    if(!farm) throw new ResourceNotFoundError("Farm is not exists")

    await this.farmsRepo.remove(farm)
  }

  // @TODO add pagination
  public async getFarms(getFarmsDto: GetFarmsDto): Promise<FarmsResDto[]> {
    const farms = await this.farmsRepo.createQueryBuilder("farm")
      .select([ "farm.id", "farm.name", "farm.address", "farm.size", "farm.yield", "farm.coordinates", "user.email" ])
      .innerJoin("farm.user", "user")
      .getMany()
    
    const origins = []
    const destinations = []

    const userCoordinates = getFarmsDto.user.coordinates as Point
    for (const farm of farms) {
      const farmCoordinates = farm.coordinates as Point

      origins.push(userCoordinates.coordinates as LatLng)
      destinations.push(farmCoordinates.coordinates as LatLng)
    }

    const distancesMatrix = await GoogleMapService.distancesMatrix({ origins, destinations })
    
    return farms.map(({ user, ...farm }, i) => plainToInstance(
        FarmsResDto, 
        { drivingDistance: distancesMatrix[i].elements[1].distance.text, owner: user, ...farm })
      )
  }
  
}
