import { NextFunction, Request, Response } from "express";
import { Point } from "geojson";
import { GoogleMapService } from "helpers/google-maps-services";
import { CreateFarmDto } from "./dto/create-farm.dto";
import { FarmsService } from "./farms.service";

export class FarmsController {
  private readonly farmsService: FarmsService;

  constructor() {
    this.farmsService = new FarmsService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createFarmDto = req.body as CreateFarmDto
      console.log(req.body, createFarmDto)
      const { geometry: { location } } = await GoogleMapService.geocode(createFarmDto.address)
      createFarmDto.coordinates = { coordinates: [location.lng, location.lat] } as Point

      const user = await this.farmsService.createFarm(createFarmDto);
      res.status(201).send(user);
    } catch (error) {
      console.log(error)
      next(error);
    }
  }

  // public async update(req: Request, res: Response, next: NextFunction) {
    
  // }

  // public async delete(req: Request, res: Response, next: NextFunction) {
    
  // }

  // public async get(req: Request, res: Response, next: NextFunction) {
    
  // }
}
