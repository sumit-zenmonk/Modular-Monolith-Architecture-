import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { EmailService } from '../../../email/mail.service';
import { FollowRepository } from '../../../repository/follow.repo';
import { MailBoxRepository } from '../../../repository/mailbox.repo';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';
import { CreateMailEntryPayload } from '../../../email/template/creator-post-to-follower/creator_post_to_follower.type';
import { InboxRepository } from '../../../repository/inbox.repo';

@Injectable()
export class CreatorPostCreatedConsumer implements OnModuleInit {
    private readonly logger = new Logger(CreatorPostCreatedConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly emailService: EmailService,
        private readonly followRepo: FollowRepository,
        private readonly mailBoxRepo: MailBoxRepository,
        private readonly inboxRepo: InboxRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.setupExchangeQueueAndBind(
            QueueEnum.MAIL_POST_CREATED_QUEUE,
            ExchangeNameEnum.CREATOR_EXCHANGE,
            RoutingKeyEnum.CREATOR_POST_CREATED,
            ExchangeTypeEnum.TOPIC,
        );

        await this.rabbitMQService.consumeMessages(
            QueueEnum.MAIL_POST_CREATED_QUEUE,
            async (data) => {
                const { outbox_uuid, payload } = data;

                this.logger.log(`Processing creator post creation: ${payload.uuid}`);

                const alreadyProcessed = await this.inboxRepo.findByOutboxUuid(outbox_uuid);
                if (alreadyProcessed) {
                    this.logger.warn(`Duplicate skipped: ${outbox_uuid}`);
                    return;
                }

                const followers = await this.followRepo.findByFollowingUuid(payload.user_uuid);
                for (const follower of followers) {
                    // not sending bulk entry
                    //await this.emailService.sendCreatorPostNotification(follower.follower, data);

                    // making db entry to later send one by one in background
                    const mailbox_entry_detail: CreateMailEntryPayload = {
                        email: follower.follower.email,
                        body: {
                            type: RoutingKeyEnum.CREATOR_POST_CREATED,
                            receiver_name: follower.follower.name,
                            creator: {
                                uuid: payload.user_uuid,
                                name: payload.user_name,
                            },
                            post: {
                                uuid: payload.uuid,
                                title: payload.title,
                                excerpt: payload.content?.slice(0, 150),
                            },
                        },
                    }
                    await this.mailBoxRepo.createMailntry(mailbox_entry_detail);
                    await this.inboxRepo.createEntry({ outbox_uuid });
                }
            },
        );
    }
}