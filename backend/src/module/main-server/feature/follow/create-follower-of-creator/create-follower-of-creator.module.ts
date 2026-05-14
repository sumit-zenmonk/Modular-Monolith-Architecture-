import { Module } from "@nestjs/common";
import { CreateFollowerOfCreatorService } from "./create-follower-of-creator.service";
import { CreateFollowerOfCreatorController } from "./create-follower-of-creator.controller";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";
import { UserRepository } from "src/module/main-server/infrastructure/repository/user.repo";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [CreateFollowerOfCreatorController],
    providers: [CreateFollowerOfCreatorService, FollowRepository, UserRepository, RabbitMQService, OutboxRepository],
    exports: [],
})

export class CreateFollowerOfCreatorModule { }