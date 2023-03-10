import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { AdminService } from "../../../shared/services/admin/admin.service";
import { JwtService } from "@nestjs/jwt";
import { AdminSignInDto } from "../../../core/dto/admin/admin-sign-in.dto";
import * as bcrypt from "bcrypt";
import { promisify } from "util";
import { AdminAuthResponseDto } from "../../../core/dto/admin/admin-auth-response.dto";
import { AdminRegisterDto } from "../../../core/dto/admin/admin-register.dto";
const bcryptComparePromise = promisify(bcrypt.compare);

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  public async signIn(body: AdminSignInDto): Promise<AdminAuthResponseDto> {
    this.logger.log("[Admin] sign in", body);
    const admin = await this.adminService.findByEmailOrFail(body.email);
    const verified = await bcryptComparePromise(body.password, admin.password);

    if (!verified) {
      throw new UnauthorizedException();
    }

    const { password, ...payload } = admin;

    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  public async register(body: AdminRegisterDto): Promise<AdminAuthResponseDto> {
    this.logger.log("[Admin] register", body);
    const admin = await this.adminService.create(body);
    const { password, ...payload } = admin;
    return {
      token: this.jwtService.sign(payload),
      user: payload,
    };
  }

  public getAuthAdmin(token: string): AdminAuthResponseDto {
    const parsedToken = token.replace("Bearer ", "");
    const verified = this.jwtService.verify(parsedToken);
    return {
      user: verified,
      token: parsedToken,
    };
  }
}
