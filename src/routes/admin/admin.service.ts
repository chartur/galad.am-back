import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AdminEntity } from "../../entities/admin.entity";
import { AdminRegisterDto } from "../../core/dto/admin/admin-register.dto";

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminEntity.name);

  constructor(
    @InjectRepository(AdminEntity)
    private adminEntityRepository: Repository<AdminEntity>,
  ) {}

  public findByEmailOrFail(email: string): Promise<AdminEntity> {
    this.logger.log("[Admin] find by email", {
      email,
    });

    return this.adminEntityRepository.findOneOrFail({
      where: {
        email,
      },
    });
  }

  public create(body: AdminRegisterDto): Promise<AdminEntity> {
    this.logger.log("[Admin] create", body);

    const admin = this.adminEntityRepository.create(body);
    return this.adminEntityRepository.save(admin);
  }
}
