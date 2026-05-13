import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { CreateMailEntryPayload } from './template/creator-post-to-follower/creator_post_to_follower.type';
import { UserEntity } from '../../domain/user/user.entity';

@Injectable()
export class EmailService {
    constructor(private mailerService: MailerService) { }

    async sendUserWelcome(user: UserEntity) {
        await this.mailerService.sendMail({
            to: user.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to Nice App! Confirm your Email',
            template: './welcome', // `.ejs` extension is appended automatically
            context: { // filling <%= %> brackets with content
                name: user.name,
            },
        });
    }

    async sendCreatorPostNotificationToFollower(data: CreateMailEntryPayload) {
        console.log(data);
        await this.mailerService.sendMail({
            to: data.email,
            subject: 'New post from creator you follow',
            template: './creator-post-to-follower/creator_post_to_follower', // `.ejs` extension is appended automatically
            context: { // filling <%= %> brackets with content
                body: data.body
            },
        });
    }
}
