import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OutboxRepository } from '../../repository/outbox.repo';
import { OutboxStatusEnum } from 'src/module/auth-server/domain/outbox/outbox.enum';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';

@Injectable()
export class OutboxEntryPublisherCronService {
    constructor(
        private readonly outboxRepo: OutboxRepository,
        private readonly rabbitMQService: RabbitMQService,
    ) { }

    private readonly logger = new Logger(OutboxEntryPublisherCronService.name,);

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        // fecth top 10 pending enteries
        const pendingEntries = await this.outboxRepo.findTopTenPendingOutBoxEntries();
        if (!pendingEntries.length) { return; }

        await Promise.all(
            pendingEntries.map(async (entry) => {
                try {
                    //push to mq
                    await this.rabbitMQService.publishToExchange(
                        ExchangeNameEnum.USER_EXCHANGE,
                        RoutingKeyEnum.USER_REGISTERED,
                        entry.message_payload,
                    );

                    // make entry success
                    await this.outboxRepo.updateStatus(entry.uuid, OutboxStatusEnum.PUBLISHED,);
                } catch (error) {
                    this.logger.error(`Failed to publish outbox entry: ${entry.uuid}`,);

                    //make entry failed
                    await this.outboxRepo.updateStatus(entry.uuid, OutboxStatusEnum.FAILED,);
                }
            }),
        );
    }
}