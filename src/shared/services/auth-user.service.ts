import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AUTH_SECRET as AdminAuthSecret, AdminEntity } from "../../entities/admin.entity";
import { AUTH_SECRET as UserAuthSecret, UserEntity } from "../../entities/user.entity";
import { AuthRole } from "../../core/constants/auth-role.enum";
import { AuthUserRegisterDto } from "../../core/dto/auth/auth-user-register.dto";
import { JwtService } from "@nestjs/jwt";
import { AdminAuthResponseDto } from "../../core/dto/admin/admin-auth-response.dto";
import { AuthUserLoginDto } from "../../core/dto/auth/auth-user-login.dto";
import { promisify } from "util";
import { AuthUser } from "../../core/interfaces/auth-user";
import * as bcrypt from "bcrypt";
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

  public create<T>(body: AuthUserRegisterDto, role: AuthRole): Promise<T> {
    this.logger(role).log(`[${role}] create`, body);
    const repo = this.repository(role);
    console.log(repo);
    const authUser = repo.create(body) as T;
    return repo.save(authUser);
  }

  public async signIn<T>(body: AuthUserLoginDto, role: AuthRole): Promise<T> {
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

    return {
      token: this.jwtService.sign(payload, {
        secret: role === AuthRole.user ? UserAuthSecret : AdminAuthSecret,
      }),
      user: payload,
    } as T;
  }

  public async register<T>(
    body: AuthUserRegisterDto,
    role: AuthRole,
  ): Promise<T> {
    this.logger(role).log(`[${role}] register`, body);
    const authUser = await this.create<AuthUser>(body, role);
    const { password, ...payload } = authUser;
    return {
      token: this.jwtService.sign(payload, {
        secret: role === AuthRole.user ? UserAuthSecret : AdminAuthSecret,
      }),
      user: payload,
    } as T;
  }

  public getAuthorizedUser<T>(token: string, role: AuthRole): T {
    const parsedToken = token.replace("Bearer ", "");
    const verified = this.jwtService.verify(parsedToken, {
      secret: role === AuthRole.user ? UserAuthSecret : AdminAuthSecret,
    });
    return {
      user: verified,
      token: parsedToken,
    } as T;
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
