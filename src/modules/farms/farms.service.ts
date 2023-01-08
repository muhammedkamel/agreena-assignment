import { DeepPartial, Repository } from "typeorm";
import dataSource from "orm/orm.config";
import { Farm } from "./entities/farm.entity";
import { CreateFarmDto } from "./dto/create-farm.dto";

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

}
