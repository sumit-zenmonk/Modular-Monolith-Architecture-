import { Module } from "@nestjs/common";
import { CreateFollowerOfCreatorService } from "./create-follower-of-creator.service";
import { CreateFollowerOfCreatorController } from "./create-follower-of-creator.controller";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";
import { UserRepository } from "src/module/main-server/infrastructure/repository/user.repo";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [CreateFollowerOfCreatorController],
    providers: [CreateFollowerOfCreatorService, FollowRepository, UserRepository,  OutboxRepository],
    exports: [],
})

export class CreateFollowerOfCreatorModule { }