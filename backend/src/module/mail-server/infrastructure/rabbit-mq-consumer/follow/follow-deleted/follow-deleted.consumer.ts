import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { FollowRepository } from '../../../repository/follow.repo';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { InboxRepository } from '../../../repository/inbox.repo';

@Injectable()
export class FollowDeletedConsumer implements OnModuleInit {
    private readonly logger = new Logger(FollowDeletedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly followRepo: FollowRepository,
        private readonly inboxRepo: InboxRepository,
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
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing follow deleted: ${payload.uuid}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                await this.followRepo.deleteFollowBond(payload.uuid);
                await this.inboxRepo.createEntry({ outbox_uuid });
            },
        );
    }
}
