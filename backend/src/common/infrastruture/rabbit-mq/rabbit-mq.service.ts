import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, PublishHeadersInterface } from "./type-enum/rabbit-mq.type";
import { ExchangeTypeEnum } from "./type-enum/rabbit-mq.enum";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private channel?: Channel;
    private connection?: ChannelModel;
    private readonly logger = new Logger(RabbitMQService.name);
    private isConnecting = false;
    private isClosing = false;

    async onModuleInit() {
        await this.connectToRabbitMQ();
    }

    async onModuleDestroy() {
        await this.closeConnection();
    }

    async connectToRabbitMQ() {
        if (this.isConnecting || this.channel) return;

        this.isConnecting = true;
        try {
            // create connection then i can create multiple channels
            this.connection = await amqp.connect(process.env.RABBIT_MQ_URL ?? "amqp://localhost:5672");
            this.channel = await this.connection.createChannel();

            // fair dispatch
            await this.channel.prefetch(1);

            // checking channel connection
            this.channel.on('error', (err: any) => {
                this.logger.error('Channel error', err);
            });

            // reconnect if connection closed
            this.connection.on("close", () => {
                this.connection = undefined;
                this.channel = undefined;
                if (this.isClosing) return;

                this.logger.warn("Connection closed, reconnecting...");
                setTimeout(() => this.connectToRabbitMQ(), 1000);
            });

            this.logger.log("Connected to RabbitMQ and created the channel");
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
        } finally {
            this.isConnecting = false;
        }
    }

    // inset exchange + inset queue -> bind both
    async setupExchangeQueueAndBind(
        queue: string,
        exchange: string,
        routingKey: string,
        type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            // ensure exchange + queue
            await channel.assertExchange(exchange, type, { durable: true, });
            await channel.assertQueue(queue, { durable: true });

            // bind queue to exchange
            await channel.bindQueue(queue, exchange, routingKey, headers);
        } catch (error) {
            this.logger.error("Error while setting up queue:", error);
        }
    }

    // consume messages
    async consumeMessages(
        queue: string,
        callback: (data: any) => Promise<void>,
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            await channel.consume(
                queue,
                async (msg) => {
                    if (!msg) return;

                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        channel.ack(msg);
                    } catch (err) {
                        this.logger.error(`Consumer error`, err);
                        channel.nack(msg, false, false);
                    }
                },
                { noAck: false },
            );
        } catch (error) {
            this.logger.error("Error while consuming messages:", error);
        }
    }

    // send message using exchange
    async publishToExchange(
        exchange: string,
        routingKey: string,
        message: any,
        // type: ExchangeType = ExchangeTypeEnum.DIRECT,
        headers?: PublishHeadersInterface
    ) {
        try {
            const channel = this.channel;
            if (!channel) return;

            // ensure exchange exists
            // await this.channel.assertExchange(exchange, type, { durable: true, });

            // amqp is binary protocol on tcp so send in binary format
            const buffer = Buffer.from(JSON.stringify(message));

            // publish message
            channel.publish(exchange, routingKey, buffer, {
                persistent: true,
                headers: headers
            });

            this.logger.log(`Sent => exchange = ${exchange} | key = ${routingKey}`);
        } catch (error) {
            this.logger.error("Send error:", error);
        }
    }

    async closeConnection() {
        try {
            this.isClosing = true;

            // close channel + connection
            await this.channel?.close();
            await this.connection?.close();

            this.logger.log("RabbitMQ connection closed");
        } catch (error) {
            this.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}
