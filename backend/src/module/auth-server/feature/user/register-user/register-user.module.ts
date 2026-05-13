import { Module } from "@nestjs/common";
import { RegisterUserController } from "./register-user.controller";
import { RegisterUserService } from "./register-user.service";
import { UserRepository } from "src/module/auth-server/infrastructure/repository/user.repo";
import { JwtHelperService } from "src/module/auth-server/infrastructure/services/jwt.service";
import { BcryptService } from "src/common/services/bcrypt.service";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";

@Module({
    imports: [],
    controllers: [RegisterUserController],
    providers: [UserRepository, RegisterUserService, JwtHelperService, BcryptService, RabbitMQService],
    exports: [],
})

export class RegisterUserModule { }