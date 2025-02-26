import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AdminSignInDto } from "../../../core/dto/admin/admin-sign-in.dto";
import { AdminAuthResponseDto } from "../../../core/dto/admin/admin-auth-response.dto";
import { AdminRegisterDto } from "../../../core/dto/admin/admin-register.dto";
import { AdminGuard } from "../../../shared/guards/admin.guard";
import { AuthUserService } from "../../../shared/services/auth-user.service";
import { AuthRole } from "../../../core/constants/auth-role.enum";
import { AuthorizationResponse } from "../../../core/dto/auth/authorization-response";
import { NotificationSettingsDto } from "../../../core/dto/auth/notification-settings.dto";
import { AuthAdmin } from "../../../core/decorators/auth-admin.decorator";
import { PusherService } from "../../../shared/services/pusher.service";

@ApiTags("Admin Auth")
@Controller("auth/admin")
export class AuthController {
  constructor(
    private authUserService: AuthUserService,
    private pusherService: PusherService,
  ) {}

  @Post("sign-in")
  @ApiOperation({
    summary: "Admin user sign in",
    description:
      "This POST request should validate admin user by credentials then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: AdminAuthResponseDto,
  })
  public signIn(@Body() body: AdminSignInDto): Promise<AuthorizationResponse> {
    return this.authUserService.signIn(body, AuthRole.admin);
  }

  @Post("sign-up")
  @ApiOperation({
    summary: "Admin user registration",
    description:
      "This POST request should register new admin user then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "Record successfully created",
    type: AdminAuthResponseDto,
  })
  public register(
    @Body() body: AdminRegisterDto,
  ): Promise<AdminAuthResponseDto> {
    return this.authUserService.register(body, AuthRole.admin);
  }

  @Get("user")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Admin user sign in",
    description:
      "This GET request should validate admin user by token then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: AdminAuthResponseDto,
  })
  @UseGuards(AdminGuard)
  public getAuthAdmin(@Headers() headers): AuthorizationResponse {
    return this.authUserService.getAuthorizedUser(
      headers["authorization"],
      AuthRole.admin,
    );
  }

  @Post("notification-settings")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Store push notification credentials",
    description:
      "This POST request should store push notification credentials of admin user",
  })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: void 0,
  })
  @UseGuards(AdminGuard)
  public notificationSettings(
    @AuthAdmin() admin,
    @Body() body: NotificationSettingsDto,
  ): void {
    return this.pusherService.subscribe(body);
  }
}
