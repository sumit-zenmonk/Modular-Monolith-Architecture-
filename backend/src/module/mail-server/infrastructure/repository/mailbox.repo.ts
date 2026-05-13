import { Injectable } from "@nestjs/common";
import { DataSource, Not, Repository } from "typeorm";
import { MailBoxEntity } from "../../domain/mailbox/mailbox";
import { MailBoxStatusEnum } from "../../domain/mailbox/mailbox.enum";
import { InjectDataSource } from "@nestjs/typeorm";

@Injectable()
export class MailBoxRepository extends Repository<MailBoxEntity> {
        constructor(
            @InjectDataSource(process.env.DB_POSTGRES_MAIL_SCHEMA || 'mail')
            private readonly dataSource: DataSource,
        ) {
            super(MailBoxEntity, dataSource.createEntityManager());
        }

    async createMailntry(body: Partial<MailBoxEntity>) {
        const user = this.create(body);
        return await this.save(user);
    }

    async findTopTenPendingMails() {
        const mails = await this.find({
            where: {
                status: MailBoxStatusEnum.PENDING
            },
            order: {
                created_at: "DESC",
            },
            take: Number(process.env.mailsendlimit) || 10
        });
        return mails;
    }

    async updateStatus(uuid: string, status: MailBoxStatusEnum) {
        return await this.update(
            {
                uuid: uuid
            },
            {
                status: status
            }
        )
    }
}