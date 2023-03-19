import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { appVersion } from "./core/constants/app-version";

@ApiTags("Application")
@Controller()
export class AppController {
  @Get()
  @ApiOperation({
    summary: "Application version",
    description: "GET request should return Application version",
  })
  @ApiResponse({
    status: 200,
    type: appVersion,
    description: "Version successfully found",
  })
  public getAppVersion(): string {
    return appVersion;
  }
}
