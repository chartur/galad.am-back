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
import { AuthService } from "./auth.service";
import { AdminAuthResponseDto } from "../../../core/dto/admin/admin-auth-response.dto";
import { AdminRegisterDto } from "../../../core/dto/admin/admin-register.dto";
import { AdminGuard } from "../../../shared/guards/admin.guard";

@ApiTags("Admin Auth")
@Controller("auth/admin")
export class AuthController {
  constructor(private authService: AuthService) {}

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
  public signIn(@Body() body: AdminSignInDto): Promise<AdminAuthResponseDto> {
    return this.authService.signIn(body);
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
    return this.authService.register(body);
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
  public getAuthAdmin(@Headers() headers): AdminAuthResponseDto {
    return this.authService.getAuthAdmin(headers["authorization"]);
  }
}
