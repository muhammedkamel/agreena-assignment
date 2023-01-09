import * as bcrypt from "bcrypt";
import config from "config/config";
import { fromUnixTime } from "date-fns";
import { UnAuthorizedError, UnprocessableEntityError } from "errors/errors";
import { decode, sign, verify } from "jsonwebtoken";
import { UsersService } from "modules/users/users.service";
import { Repository } from "typeorm";
import { LoginUserDto } from "./dto/login-user.dto";
import { AccessToken } from "./entities/access-token.entity";
import dataSource from "orm/orm.config";
import { AccessTokenDto } from "./dto/access-token.dto";
import { MoreThanDate } from "helpers/typeorm-operators";

export class AuthService {
  private readonly accessTokenRepository: Repository<AccessToken>;
  private readonly usersService: UsersService;

  constructor() {
    this.accessTokenRepository = dataSource.getRepository(AccessToken);
    this.usersService = new UsersService();
  }

  public async login(data: LoginUserDto): Promise<AccessToken> {
    const user = await this.usersService.findOneBy({ email: data.email });

    if (!user) throw new UnprocessableEntityError("Invalid user email or password");

    const isValidPassword = await this.validatePassword(data.password, user.hashedPassword);

    if (!isValidPassword) throw new UnprocessableEntityError("Invalid user email or password");

    const token = sign(
      {
        id: user.id,
        email: user.email,
      },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_AT },
    );
    const tokenExpireDate = this.getJwtTokenExpireDate(token);

    const newToken = this.accessTokenRepository.create({
      token,
      user,
      expiresAt: fromUnixTime(tokenExpireDate),
    });

    return this.accessTokenRepository.save(newToken);
  }

  private getJwtTokenExpireDate(token: string): number {
    const { exp } = decode(token) as { [exp: string]: number };
    return exp;
  }

  private async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  public async authenticate(accessTokenDto: AccessTokenDto) {
    try{
      verify(accessTokenDto.token, config.JWT_SECRET)
    } catch(error: any) {
      throw new UnAuthorizedError("Invalid access token")
    }

    const accessToken = await this.findActiveAccessToken(accessTokenDto.token)

    if(!accessToken) throw new UnAuthorizedError("Invalid access token")

    return accessToken.user
  }

  public async findActiveAccessToken(token: string): Promise<AccessToken | null> {
    return this.accessTokenRepository.createQueryBuilder("token")
      .where({ token })
      .andWhere({ expiresAt: MoreThanDate(new Date()) })
      .select(["token.id", "user.id", "user.email", "user.address"])
      .innerJoin("token.user", "user")
      .getOne()
  }
}
