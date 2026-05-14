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
    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        // fetch top 10 pending mail 
        const pendingmails = await this.mailBoxRepo.findTopTenPendingMails();
        if (!pendingmails.length) {
            return;
        }

        try {
            // make entry object perfect
            const mailboxEntries: CreateMailEntryPayload[] = pendingmails.map((mail) => ({
                email: mail.email,
                body: mail.body as CreatorPostCreatedMailBody,
            }));
            //send batch entry object to email service
            await this.emailService.sendBacthEmailCreatorPostNotificationToFollower(mailboxEntries);

            //make every field status send
            await Promise.all(
                pendingmails.map(async (mail) => {
                    await this.mailBoxRepo.updateStatus(mail.uuid, MailBoxStatusEnum.SENT,);
                }),
            );
        } catch (error) {
            this.logger.error(`Failed to send batch mail`);

            //make every field status failed
            await Promise.all(
                pendingmails.map(async (mail) => {
                    await this.mailBoxRepo.updateStatus(mail.uuid, MailBoxStatusEnum.FAILED,);
                }),
            );
        }
    }
}