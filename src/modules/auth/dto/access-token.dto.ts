import { IsJWT, IsNotEmpty } from "class-validator";

export class AccessTokenDto {
  @IsNotEmpty()
  @IsJWT()
  public token: string
}
