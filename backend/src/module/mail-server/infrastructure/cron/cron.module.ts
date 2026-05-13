import { Global, Module } from '@nestjs/common';
import { MailModule } from '../email/mail.module';
import { CreatorPostToFollowerCronService } from './creator-post-to-follower/creator-post-to-follower';
import { MailBoxRepository } from '../repository/mailbox.repo';
import { ScheduleModule } from '@nestjs/schedule';

@Global()
@Module({
    imports: [
        MailModule,
        ScheduleModule.forRoot()
    ],
    providers: [
        CreatorPostToFollowerCronService,
        MailBoxRepository,
    ],
    exports: [CreatorPostToFollowerCronService],
})
export class CronModule { }