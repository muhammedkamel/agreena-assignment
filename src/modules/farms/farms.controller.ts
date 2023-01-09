import { NextFunction, Request, Response } from "express";
import { Point } from "geojson";
import { GoogleMapService } from "helpers/google-maps-services";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { DeleteFarmDto } from "./dto/delete-farm.dto";
import { GetFarmsDto } from "./dto/get-farms-dto";
import { UpdateFarmDto } from "./dto/update-farm.dto";
import { FarmsService } from "./farms.service";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createFarmDto = req.body as CreateFarmDto

      // @TODO move to service
      const { geometry: { location } } = await GoogleMapService.geocode(createFarmDto.address)
      createFarmDto.coordinates = { coordinates: [location.lng, location.lat] } as Point

      const farm = await this.farmsService.createFarm(createFarmDto);
      res.status(201).send(farm);
    } catch (error) {
      next(error);
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const updateFarmDto =  { id: req.params.id, ...req.body } as UpdateFarmDto

      const farm = await this.farmsService.updateFarm(updateFarmDto);
      res.status(200).send(farm);
    } catch (error) {
      next(error);
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const deleteFarmDto = { id: req.params.id, ...req.body } as DeleteFarmDto

      await this.farmsService.deleteFarm(deleteFarmDto);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async get(req: Request, res: Response, next: NextFunction) {
    try {
      const getFarmsDto = { ...req.params, ...req.body } as GetFarmsDto
      const farms = await this.farmsService.getFarms(getFarmsDto);

      res.status(200).send(farms);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }
}
