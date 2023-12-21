import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Patch,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserAuthGuard } from "../../shared/guards/user-auth.guard";
import { UserEntity } from "../../entities/user.entity";
import { ProfileService } from "./profile.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Uploader } from "../../utils/uploader";
import { DeleteUploadedFileOnErrorFilter } from "../../core/filters/delete-uploaded-file-on-error.filter";
import { UpdatePersonalSettingsRequestDto } from "../../core/dto/profile/update-personal-settings.request.dto";
import { AuthUser } from "../../core/decorators/auth-user.decorator";
import { ResponseUser } from "../../core/interfaces/response-user";
import { AuthorizationResponse } from "../../core/interfaces/authorization-response";

@Controller("profile")
@ApiTags("Profile")
@UseGuards(UserAuthGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Patch("/personal-settings")
  @ApiBearerAuth()
  @ApiOperation({
    summary: "Update user personal info",
    description: "PATCH request should update user personal info data",
  })
  @ApiResponse({
    status: 200,
    type: UserEntity,
    description: "The record successfully updated",
  })
  @UseInterceptors(
    FileInterceptor("image", {
      storage: Uploader.fileStore(() => "./public/users"),
    }),
  )
  @UseFilters(DeleteUploadedFileOnErrorFilter)
  public updatePersonalSettings(
    @AuthUser() authUser: ResponseUser,
    @Body() body: UpdatePersonalSettingsRequestDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: ".(png|jpeg|jpg)" })],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ): Promise<AuthorizationResponse> {
    return this.profileService.updatePersonalSettings(authUser, body, file);
  }
}
