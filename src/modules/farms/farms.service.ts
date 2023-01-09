import { DeepPartial, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { GoogleMapService } from "helpers/google-maps-services";
import { Point } from "geojson";
import { ResourceNotFoundError } from "errors/errors";

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

  public async updateFarm(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    const farm = await this.findUserFarmById(id, updateFarmDto.user.id)

    if(!farm) throw new ResourceNotFoundError("Farm is not exists")

    if(updateFarmDto.address && updateFarmDto.address !== farm.address) {
      const { geometry: { location } } = await GoogleMapService.geocode(updateFarmDto.address)
      updateFarmDto.coordinates = { coordinates: [location.lng, location.lat] } as Point
    }

    Object.assign(farm, updateFarmDto)

    return this.farmsRepo.save(farm)
  }

  public async findUserFarmById(id: string, userId: string): Promise<Farm | null> {
    return this.farmsRepo.findOne({
      relations: ["user"],
      where: {
        id,
        user: {
          id: userId
        }
      }
    })
  }
}
