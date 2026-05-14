import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePostDto } from "./create-post.dto";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { PostRepository } from "src/module/main-server/infrastructure/repository/post.repo";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Injectable()
export class CreatePostService {
    constructor(
        private readonly postRepo: PostRepository,
        private readonly rabbitMQService: RabbitMQService,
        private readonly outboxRepo: OutboxRepository
    ) { }

    async createPost(user: UserEntity, body: CreatePostDto) {
        const post = await this.postRepo.createPost({ user_uuid: user.uuid, ...body });

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.CREATOR_EXCHANGE,
        //     RoutingKeyEnum.CREATOR_POST_CREATED,
        //     post,
        // );

        // make entry of publish exchange
        await this.outboxRepo.createOutboxntry({
            exchange_name: ExchangeNameEnum.CREATOR_EXCHANGE,
            routing_key: RoutingKeyEnum.CREATOR_POST_CREATED,
            message_payload: post,
        });

        return {
            post: post,
            message: "Post Created Success"
        }
    }
}