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
import { FarmsResDto } from "./dto/farms-res-dto";
import { plainToInstance } from "class-transformer";
import { SortFieldMap, SortValueMap } from "./enums/sort";

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

  /**
   * @todo add pagination
   * @note For sorting by driving distance, it is not optimal to sort them on the fly.
   * Instead we should use a warming mechanism that can calculate all the distances,
   * foreach user against all the farms and set them in the db with the appropriate indexes
   */
  public async getFarms(getFarmsDto: GetFarmsDto): Promise<FarmsResDto[]> {
    const farms = await this.filterFarms(getFarmsDto)

    const origins = []
    const destinations = []

    for (const farm of farms) {
      origins.push(getFarmsDto.user.address)
      destinations.push(farm.address)
    }

    const distancesMatrix = await GoogleMapService.distancesMatrix({ origins, destinations })

    const farmsDtos = distancesMatrix.filter((ele, i) => ele.elements[i].distance).map((ele, i) => {
      const {user, ...farm} = farms[i]

      return plainToInstance(
        FarmsResDto, 
        { drivingDistance: ele.elements[i].distance.value, owner: user, ...farm }
      )
    })

    if(getFarmsDto.sort === SortFieldMap.DRIVING_DISTANCE) farmsDtos.sort((a, b) => a.drivingDistance - b.drivingDistance)

    return farmsDtos
  }

  public async filterFarms(getFarmsDto: GetFarmsDto): Promise<Farm[]> {
    const qb = this.farmsRepo.createQueryBuilder("farm")
      .select([ "farm.id", "farm.name", "farm.address", "farm.size", "farm.yield", "user.email" ])
      .innerJoin("farm.user", "user");

    if(getFarmsDto.outliers) qb.groupBy("farm.id, user.id, user.email").having("farm.yield * 100 / AVG(farm.yield) <> 30")
      
    if(getFarmsDto.sort && getFarmsDto.sort != SortFieldMap.DRIVING_DISTANCE) {
      qb.orderBy(
        `farm.${SortFieldMap[getFarmsDto.sort as keyof typeof SortFieldMap]}`,
        SortValueMap[getFarmsDto.sort as keyof typeof SortValueMap] 
      )
    }

    return qb.getMany()
  }

}
