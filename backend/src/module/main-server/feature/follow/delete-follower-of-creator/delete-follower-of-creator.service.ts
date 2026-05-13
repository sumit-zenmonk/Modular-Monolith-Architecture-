import { BadRequestException, Injectable } from "@nestjs/common";
import { RabbitMQService } from "src/common/infrastruture/rabbit-mq/rabbit-mq.service";
import { ExchangeNameEnum, RoutingKeyEnum } from "src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum";
import { UserEntity } from "src/module/main-server/domain/user/user.entity";
import { FollowRepository } from "src/module/main-server/infrastructure/repository/follow.repo";

@Injectable()
export class DeleteFollowerOfCreatorService {
    constructor(
        private readonly followRepo: FollowRepository,
        private readonly rabbitMQService: RabbitMQService
    ) { }

    async deleteFollowerOfCreatorService(follow_uuid: string, user: UserEntity) {
        const isFollowBondExists = await this.followRepo.findByUuid(follow_uuid);
        if (!isFollowBondExists.length) {
            throw new BadRequestException("Follow Bond not found");
        }

        await this.followRepo.deleteFollowBond(follow_uuid);

        await this.rabbitMQService.publishToExchange(
            ExchangeNameEnum.CREATOR_EXCHANGE,
            RoutingKeyEnum.FOLLOW_DELETED,
            isFollowBondExists[0],
        );

        return {
            message: "Follow Bond deleted successfully"
        };
    }
}