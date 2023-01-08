import { NextFunction, Request, Response } from "express";
import { AuthService } from "modules/auth/auth.service";
import { AccessTokenDto } from "modules/auth/dto/access-token.dto";

export async function auth(req: Request, _res: Response, next: NextFunction): Promise<void> {
  const accessTokenDto: AccessTokenDto = { token: req.headers.authorization?.substring(7) as string }
  const authService = new AuthService()

  try {
    const user = await authService.authenticate(accessTokenDto)
    
    Object.assign(req.body, { user })
  } catch (error) {
    next(error);
  }  

  next()
}
