import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { UserRepository } from '../../../repository/user.repo';
import { RabbitMQService } from 'src/common/infrastruture/rabbit-mq/rabbit-mq.service';
import { ExchangeNameEnum, ExchangeTypeEnum, QueueEnum, RoutingKeyEnum } from 'src/common/infrastruture/rabbit-mq/type-enum/rabbit-mq.enum';

@Injectable()
export class UserRegisteredConsumer implements OnModuleInit {
    private readonly logger = new Logger(UserRegisteredConsumer.name);

    constructor(
        private readonly rabbitMQService: RabbitMQService,
        private readonly userRepo: UserRepository,
    ) { }

    async onModuleInit() {
        await this.rabbitMQService.setupExchangeQueueAndBind(
            QueueEnum.MAIN_USER_QUEUE,
            ExchangeNameEnum.USER_EXCHANGE,
            RoutingKeyEnum.USER_REGISTERED,
            ExchangeTypeEnum.TOPIC,
        );

        await this.rabbitMQService.consumeMessages(
            QueueEnum.MAIN_USER_QUEUE,
            async (data) => {
                this.logger.log(`Processing registered user: ${data.email} \n ${JSON.stringify(data)}`,);

                await this.userRepo.register(data);
            },
        );
    }
}