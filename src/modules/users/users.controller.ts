import { NextFunction, Request, Response } from "express";
import { Point } from "geojson";
import { GoogleMapService } from "helpers/google-maps-services";
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";

export class UsersController {
  private readonly usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const userDto = req.body as CreateUserDto

      const {geometry:{location}} = await GoogleMapService.geocode(userDto.address)      
      userDto.coordinates = { coordinates: [location.lng, location.lat] } as Point

      const user = await this.usersService.createUser(userDto);
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
}
