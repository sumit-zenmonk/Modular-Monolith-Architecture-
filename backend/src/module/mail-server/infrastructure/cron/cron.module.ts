import { Global, Module } from '@nestjs/common';
import { MailModule } from '../email/mail.module';
import { PostCreatedFollowerNotifierCronService } from './post-created-email.publisher/post-created-email.publisher';
import { MailBoxRepository } from '../repository/mailbox.repo';

@Global()
@Module({
    imports: [
        MailModule,
    ],
    providers: [
        PostCreatedFollowerNotifierCronService,
        MailBoxRepository,
    ],
    exports: [],
})
export class CronModule { }