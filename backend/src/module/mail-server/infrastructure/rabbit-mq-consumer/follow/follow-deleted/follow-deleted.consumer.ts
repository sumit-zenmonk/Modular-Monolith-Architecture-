import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { FollowRepository } from '../../../repository/follow.repo';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';

@Injectable()
export class FollowDeletedConsumer implements OnModuleInit {
    private readonly logger = new Logger(FollowDeletedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly followRepo: FollowRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.setupExchangeQueueAndBind(
            QueueEnum.MAIL_FOLLOW_DELETED_QUEUE,
            ExchangeNameEnum.CREATOR_EXCHANGE,
            RoutingKeyEnum.FOLLOW_DELETED,
            ExchangeTypeEnum.TOPIC,
        );

        await this.rabbitMQService.consumeMessages(
            QueueEnum.MAIL_FOLLOW_DELETED_QUEUE,
            async (data) => {
                this.logger.log(`Processing follow deleted: ${data.uuid}`);

                await this.followRepo.deleteFollowBond(data.uuid);
            },
        );
    }
}
