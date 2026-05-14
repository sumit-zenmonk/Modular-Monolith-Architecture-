import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateFollowerOfCreatorDto } from "./create-follower-of-creator.dto";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";
import { UserRepository } from "src/module/main-server/infrastructure/repository/user.repo";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { UserRoleEnum } from "src/module/main-server/domain/user/user.enum";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Injectable()
export class CreateFollowerOfCreatorService {
    constructor(
        private readonly followRepo: FollowRepository,
        private readonly userRepo: UserRepository,
        private readonly rabbitMQService: RabbitMQService,
        private readonly outboxRepo: OutboxRepository
    ) { }

    async createFollowerOfCreator(user: UserEntity, body: CreateFollowerOfCreatorDto) {
        const isFollowerAUserNotAdmin = await this.userRepo.findByUuid(body.follower_uuid);
        const isFollowingAUserNotAdmin = await this.userRepo.findByUuid(body.following_uuid);

        if (isFollowerAUserNotAdmin?.role == UserRoleEnum.CREATOR) {
            throw new BadRequestException("Follower should be user not admin");
        }
        if (isFollowingAUserNotAdmin?.role == UserRoleEnum.USER) {
            throw new BadRequestException("Following should be admin not user");
        }

        const isFollowerExists = await this.followRepo.findByFollowerAndFollwoing(body.follower_uuid, body.following_uuid);
        if (isFollowerExists) {
            throw new BadRequestException("Already Followed Creator");
        }

        const follow = await this.followRepo.createFollowerBond(body);

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.CREATOR_EXCHANGE,
        //     RoutingKeyEnum.FOLLOW_CREATED,
        //     follow,
        // );

        // make entry of publish exchange
        await this.outboxRepo.createOutboxntry({
            exchange_name: ExchangeNameEnum.CREATOR_EXCHANGE,
            routing_key: RoutingKeyEnum.FOLLOW_CREATED,
            message_payload: follow,
        });

        return {
            follow: follow,
            message: "Follow Bond created"
        }
    }
}