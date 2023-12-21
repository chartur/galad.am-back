import { Injectable } from "@nestjs/common";
import { UpdatePersonalSettingsRequestDto } from "../../core/dto/profile/update-personal-settings.request.dto";
import { ResponseUser } from "../../core/interfaces/response-user";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../../entities/user.entity";
import { AuthUserService } from "../../shared/services/auth-user.service";
import { AuthRole } from "../../core/constants/auth-role.enum";
import { AuthorizationResponse } from "../../core/interfaces/authorization-response";
import * as fs from "fs";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private userEntityRepository: Repository<UserEntity>,
    private authUserService: AuthUserService,
  ) {}
  public async updatePersonalSettings(
    authUser: ResponseUser,
    body: UpdatePersonalSettingsRequestDto,
    file: Express.Multer.File,
  ): Promise<AuthorizationResponse> {
    const user = await this.userEntityRepository.save({
      ...authUser,
      email: body.email,
      fullName: body.fullName,
      image: file?.path || authUser.image,
    });
    if (file?.path && authUser.image && authUser.image !== file.path) {
      fs.unlink(authUser.image, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
    return this.authUserService.getAuthorizationData(user, AuthRole.user);
  }
}
