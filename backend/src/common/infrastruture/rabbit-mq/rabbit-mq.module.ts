import { Global, Module } from '@nestjs/common';
import { RabbitMQService } from './rabbit-mq.service';
import { UserRegisteredConsumer } from '../../../module/mail-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import * as MainConsumer from '../../../module/main-server/infrastructure/rabbit-mq-consumer/user/user-registered/user-registered.consumer';
import { CreatorPostCreatedConsumer } from '../../../module/mail-server/infrastructure/rabbit-mq-consumer/post/creator-post-created/creator-post-created.consumer';
import { FollowCreatedConsumer } from '../../../module/mail-server/infrastructure/rabbit-mq-consumer/follow/follow-created/follow-created.consumer';
import { FollowDeletedConsumer } from '../../../module/mail-server/infrastructure/rabbit-mq-consumer/follow/follow-deleted/follow-deleted.consumer';
import { MailModule } from 'src/module/mail-server/infrastructure/email/mail.module';
import { UserRepository } from 'src/module/auth-server/infrastructure/repository/user.repo';
import * as mailRepo from 'src/module/mail-server/infrastructure/repository/user.repo';
import * as mainRepo from 'src/module/main-server/infrastructure/repository/user.repo';
import { MailBoxRepository } from 'src/module/mail-server/infrastructure/repository/mailbox.repo';
import { FollowRepository } from 'src/module/mail-server/infrastructure/repository/follow.repo';
import { InboxRepository } from 'src/module/main-server/infrastructure/repository/inbox.repo';
import * as MailRepo from 'src/module/mail-server/infrastructure/repository/inbox.repo';

@Global()
@Module({
    imports: [MailModule],
    providers: [
        RabbitMQService,
        UserRepository,
        mailRepo.UserRepository,
        mainRepo.UserRepository,
        MainConsumer.UserRegisteredConsumer,
        FollowRepository,
        UserRegisteredConsumer,
        CreatorPostCreatedConsumer,
        FollowCreatedConsumer,
        FollowDeletedConsumer,
        MailBoxRepository,
        InboxRepository,
        MailRepo.InboxRepository,
    ],
    exports: [RabbitMQService],
})
export class RabbitMQModule { }