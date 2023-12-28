import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  AUTH_SECRET as AdminAuthSecret,
  AdminEntity,
} from "../../entities/admin.entity";
import {
  AUTH_SECRET as UserAuthSecret,
  UserEntity,
} from "../../entities/user.entity";
import { AuthRole } from "../../core/constants/auth-role.enum";
import { AuthUserRegisterDto } from "../../core/dto/auth/auth-user-register.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthUserLoginDto } from "../../core/dto/auth/auth-user-login.dto";
import { promisify } from "util";
import { AuthUser } from "../../core/interfaces/auth-user";
import * as bcrypt from "bcrypt";
import {
  ResponseAdmin,
  ResponseUser,
} from "../../core/interfaces/response-user";
import { AuthorizationResponse } from "../../core/dto/auth/authorization-response";
const bcryptComparePromise = promisify(bcrypt.compare);

@Injectable()
export class AuthUserService {
  private readonly adminLogger = new Logger(AdminEntity.name);
  private readonly userLogger = new Logger(UserEntity.name);

  constructor(
    private jwtService: JwtService,
    @InjectRepository(AdminEntity)
    private adminEntityRepository: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
  ) {}

  public findByEmailOrFail<T>(email: string, role: AuthRole): Promise<T> {
    this.logger(role).log(`[${role}] find by email`, {
      email,
    });

    return this.repository(role).findOneOrFail({
      where: {
        email,
      },
    }) as Promise<T>;
  }

  public create(body: AuthUserRegisterDto, role: AuthRole): Promise<AuthUser> {
    this.logger(role).log(`[${role}] create`, body);
    const repo = this.repository(role);
    const authUser = repo.create(body);
    return repo.save(authUser);
  }

  public async signIn(
    body: AuthUserLoginDto,
    role: AuthRole,
  ): Promise<AuthorizationResponse> {
    this.logger(role).log(`[${role}] sign in`, body);
    const authUser = await this.findByEmailOrFail<AuthUser>(body.email, role);
    const verified = await bcryptComparePromise(
      body.password,
      authUser.password,
    );

    if (!verified) {
      throw new UnauthorizedException();
    }

    const { password, ...payload } = authUser;

    return this.getAuthorizationData(
      payload as ResponseUser | ResponseAdmin,
      role,
    );
  }

  public async register(
    body: AuthUserRegisterDto,
    role: AuthRole,
  ): Promise<AuthorizationResponse> {
    this.logger(role).log(`[${role}] register`, body);
    const authUser = await this.create(body, role);
    const { password, ...payload } = authUser;
    return this.getAuthorizationData(
      payload as ResponseUser | ResponseAdmin,
      role,
    );
  }

  public getAuthorizedUser(
    token: string,
    role: AuthRole,
  ): AuthorizationResponse {
    const parsedToken = token.replace("Bearer ", "");
    const verified = this.jwtService.verify(parsedToken, {
      secret: role === AuthRole.user ? UserAuthSecret : AdminAuthSecret,
    });
    return {
      user: verified,
      token: parsedToken,
    };
  }

  public getAuthorizationData(
    user: ResponseUser | ResponseAdmin,
    role: AuthRole,
  ): AuthorizationResponse {
    return {
      token: this.jwtService.sign(user, {
        secret: role === AuthRole.user ? UserAuthSecret : AdminAuthSecret,
      }),
      user: user,
    };
  }

  private repository(role: AuthRole): Repository<AdminEntity | UserEntity> {
    return role === AuthRole.user
      ? this.userEntityRepository
      : this.adminEntityRepository;
  }

  private logger(role: AuthRole) {
    return role === AuthRole.user ? this.userLogger : this.adminLogger;
  }
}
