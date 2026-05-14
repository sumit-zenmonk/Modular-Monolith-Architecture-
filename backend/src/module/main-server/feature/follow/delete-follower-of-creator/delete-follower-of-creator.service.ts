import { BadRequestException, Injectable } from "@nestjs/common";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";
import { OutboxRepository } from "src/module/main-server/infrastructure/repository/outbox.repo";

@Injectable()
export class DeleteFollowerOfCreatorService {
    constructor(
        private readonly followRepo: FollowRepository,
        private readonly rabbitMQService: RabbitMQService,
        private readonly outboxRepo: OutboxRepository
    ) { }

    async deleteFollowerOfCreatorService(follow_uuid: string, user: UserEntity) {
        const isFollowBondExists = await this.followRepo.findByUuid(follow_uuid);
        if (!isFollowBondExists.length) {
            throw new BadRequestException("Follow Bond not found");
        }

        await this.followRepo.deleteFollowBond(follow_uuid);

        // not publish direct to mq-queue
        // await this.rabbitMQService.publishToExchange(
        //     ExchangeNameEnum.CREATOR_EXCHANGE,
        //     RoutingKeyEnum.FOLLOW_DELETED,
        //     isFollowBondExists[0],
        // );

        // make entry of publish exchange
        await this.outboxRepo.createOutboxntry({
            exchange_name: ExchangeNameEnum.CREATOR_EXCHANGE,
            routing_key: RoutingKeyEnum.FOLLOW_DELETED,
            message_payload: isFollowBondExists[0],
        });

        return {
            message: "Follow Bond deleted successfully"
        };
    }
}