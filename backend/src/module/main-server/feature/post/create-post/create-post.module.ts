import { Module } from "@nestjs/common";
import { CreatePostController } from "./create-post.controller";
import { CreatePostService } from "./create-post.service";
import { PostRepository } from "src/module/main-server/infrastructure/repository/post.repo";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Module({
    imports: [],
    controllers: [CreatePostController],
    providers: [CreatePostService, PostRepository, RabbitMQService, OutboxRepository],
    exports: [],
})

export class CreatePostModule { }