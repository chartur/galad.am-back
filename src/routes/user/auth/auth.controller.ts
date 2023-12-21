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
import { AdminAuthResponseDto } from "../../../core/dto/admin/admin-auth-response.dto";
import { AuthUserService } from "../../../shared/services/auth-user.service";
import { AuthRole } from "../../../core/constants/auth-role.enum";
import { UserAuthResponseDto } from "../../../core/dto/user/user-auth-response.dto";
import { UserSignInDto } from "../../../core/dto/user/user-sign-in.dto";
import { UserRegisterDto } from "../../../core/dto/user/user-register.dto";
import { UserAuthGuard } from "../../../shared/guards/user-auth.guard";
import { AuthorizationResponse } from "../../../core/interfaces/authorization-response";

@ApiTags("User Auth")
@Controller("auth/user")
export class AuthController {
  constructor(private authUserService: AuthUserService) {}

  @Post("sign-in")
  @ApiOperation({
    summary: "User sign in",
    description:
      "This POST request should validate user by credentials then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: UserAuthResponseDto,
  })
  public signIn(@Body() body: UserSignInDto): Promise<AuthorizationResponse> {
    return this.authUserService.signIn(body, AuthRole.user);
  }

  @Post("sign-up")
  @ApiOperation({
    summary: "User registration",
    description:
      "This POST request should register new user then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "Record successfully created",
    type: UserAuthResponseDto,
  })
  public register(
    @Body() body: UserRegisterDto,
  ): Promise<AdminAuthResponseDto> {
    return this.authUserService.register(body, AuthRole.user);
  }

  @Get("user")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "User sign in",
    description:
      "This GET request should validate user by token then return data with token",
  })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: UserAuthResponseDto,
  })
  @UseGuards(UserAuthGuard)
  public getAuthAdmin(@Headers() headers): AuthorizationResponse {
    return this.authUserService.getAuthorizedUser(
      headers["authorization"],
      AuthRole.user,
    );
  }
}
