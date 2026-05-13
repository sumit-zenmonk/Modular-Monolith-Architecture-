import { Module } from "@nestjs/common";
import { RegisterUserModule } from "./register-user/register-user.module";
import { RouterModule } from "@nestjs/core";
import { LoginUserModule } from "./login-user/login-user.module";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";

@Module({
    imports: [
        RegisterUserModule,
        LoginUserModule,
        RouterModule.register([
            {
                path: 'user',
                children: [
                    { path: '/', module: RegisterUserModule },
                    { path: '/', module: LoginUserModule },
                ],
            },
        ]),
    ],
    controllers: [],
    providers: [RabbitMQService],
    exports: [UserModule],
})

export class UserModule { }