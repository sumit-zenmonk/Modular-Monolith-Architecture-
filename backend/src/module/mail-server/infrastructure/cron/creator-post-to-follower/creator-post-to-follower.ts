import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MailBoxRepository } from '../../repository/mailbox.repo';
import { EmailService } from '../../email/mail.service';
import { CreateMailEntryPayload, CreatorPostCreatedMailBody } from '../../email/template/creator-post-to-follower/creator_post_to_follower.type';
import { MailBoxStatusEnum } from 'src/module/mail-server/domain/mailbox/mailbox.enum';

@Injectable()
export class CreatorPostToFollowerCronService {
    constructor(
        private readonly mailBoxRepo: MailBoxRepository,
        private readonly emailService: EmailService,
    ) { }
    private readonly logger = new Logger(CreatorPostToFollowerCronService.name);

    // Runs every minute
    @Cron(CronExpression.EVERY_MINUTE)
    async handleCron() {
        // fetch top 10 pending mail 
        const pendingmails = await this.mailBoxRepo.findTopTenPendingMails();
        await Promise.all(
            pendingmails.map(async (mail) => {
                try {
                    const mailboxEntry: CreateMailEntryPayload = {
                        email: mail.email,
                        body: mail.body as CreatorPostCreatedMailBody,
                    };

                    await this.emailService.sendCreatorPostNotificationToFollower(mailboxEntry);
                    await this.mailBoxRepo.updateStatus(mail.uuid, MailBoxStatusEnum.SENT,);
                } catch (error) {
                    this.logger.error(`Failed to send mail ${mail.uuid}`,);

                    await this.mailBoxRepo.updateStatus(mail.uuid, MailBoxStatusEnum.FAILED,);
                }
            }),
        );
    }
}