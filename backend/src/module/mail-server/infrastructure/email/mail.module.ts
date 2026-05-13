import { Global, Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { EmailService } from './mail.service';

const { EjsAdapter } = require('@nestjs-modules/mailer/dist/adapters/ejs.adapter');

@Global()
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.EMAIL_HOST,
                port: Number(process.env.EMAIL_PORT) || 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USERNAME,
                    pass: process.env.EMAIL_PASSWORD,
                },
            },

            template: {
                dir: join(process.cwd(), 'src/module/mail-server/infrastructure/email/template'),
                adapter: new EjsAdapter(),
                options: {
                    strict: false,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class MailModule { }