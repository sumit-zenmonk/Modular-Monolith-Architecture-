import { Module } from "@nestjs/common";
import { DeleteFollowerOfCreatorController } from "./delete-follower-of-creator.controller";
import { DeleteFollowerOfCreatorService } from "./delete-follower-of-creator.service";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [DeleteFollowerOfCreatorController],
    providers: [DeleteFollowerOfCreatorService, FollowRepository, OutboxRepository],
    exports: [],
})

export class DeleteFollowerOfCreatorModule { }