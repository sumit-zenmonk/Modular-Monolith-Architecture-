import { Global, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { OutboxEntryPublisherCronService } from './outbox.entry.publisher/outbox.entry.publisher';
import { OutboxRepository } from '../repository/outbox.repo';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';

@Global()
@Module({
    imports: [
        ScheduleModule.forRoot()
    ],
    providers: [
        OutboxEntryPublisherCronService,
        OutboxRepository,
        RabbitMQService,
    ],
    exports: [OutboxEntryPublisherCronService],
})
export class CronModule { }