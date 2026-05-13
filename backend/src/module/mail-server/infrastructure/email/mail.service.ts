import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateMailEntryPayload } from './template/creator-post-to-follower/creator_post_to_follower.type';
import { UserEntity } from '../../domain/user/user.entity';
import { Resend } from 'resend';
import * as ejs from 'ejs';
import * as path from 'path';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) { }
    private readonly resend = new Resend(process.env.RESEND_API_KEY)

    async sendUserWelcome(user: UserEntity) {
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './user-registered/welcome', // `.ejs` extension is appended automatically
            context: { // filling <%= %> brackets with content
                name: user.name,
            },
        });
    }

    async sendBacthEmailCreatorPostNotificationToFollower(data: CreateMailEntryPayload[]) {
        // fetch path
        const templatePath = path.join(
            process.cwd(),
            'src/module/mail-server/infrastructure/email/template/creator-post-to-follower/creator_post_to_follower.ejs',
        );

        // making email batch obj acc to resend
        const emails = await Promise.all(
            data.map(async (item) => {
                const html = await ejs.renderFile(templatePath, { body: item.body, });

                return {
                    from: 'Nice App <onboarding@resend.dev>',
                    to: 'sumitkumarshaab@gmail.com',//item.email
                    subject: 'New post from creator you follow',
                    html,
                };
            }),
        );

        await this.resend.batch.send(emails);
    }
}
