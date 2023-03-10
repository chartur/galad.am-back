import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AdminEntity } from "../../../entities/admin.entity";
import { Repository } from "typeorm";
import { AdminRegisterDto } from "../../../core/dto/admin/admin-register.dto";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminEntityRepository: Repository<AdminEntity>,
  ) {}

  public findByEmailOrFail(email: string): Promise<AdminEntity> {
    return this.adminEntityRepository.findOneOrFail({
      where: {
        email,
      },
    });
  }

  public create(body: AdminRegisterDto): Promise<AdminEntity> {
    const admin = this.adminEntityRepository.create(body);
    return this.adminEntityRepository.save(admin);
  }
}
