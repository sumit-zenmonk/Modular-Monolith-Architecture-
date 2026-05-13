import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from "@nestjs/common";
import amqp, { Channel, ChannelModel } from "amqplib";
import { ExchangeType, PublishHeadersInterface } from "./type-enum/rabbit-mq.type";
import { ExchangeTypeEnum } from "./type-enum/rabbit-mq.enum";

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
    private channel: Channel;
    private connection: ChannelModel;
    private readonly logger = new Logger(RabbitMQService.name);
    private ready: Promise<void>;

    async onModuleInit() {
        this.ready = this.connectToRabbitMQ();
        await this.ready;
    }

    async onModuleDestroy() {
        await this.closeConnection();
    }

    private async ensureReady() {
        await this.ready;
    }

    async connectToRabbitMQ() {
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
                this.logger.warn("Connection closed, reconnecting...");
                setTimeout(() => this.connectToRabbitMQ(), 1000);
            });

            this.logger.log("Connected to RabbitMQ and created the channel");
        } catch (error) {
            this.logger.error("Error connecting to RabbitMQ:", error);
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
            await this.ensureReady();
            // ensure exchange + queue
            await this.channel.assertExchange(exchange, type, { durable: true, });
            await this.channel.assertQueue(queue, { durable: true });

            // bind queue to exchange
            await this.channel.bindQueue(queue, exchange, routingKey, headers);
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
            await this.ensureReady();
            await this.channel.consume(
                queue,
                async (msg) => {
                    if (!msg) return;

                    try {
                        const content = JSON.parse(msg.content.toString());
                        await callback(content);
                        this.channel.ack(msg);
                    } catch (err) {
                        this.logger.error(`Consumer error`, err);
                        this.channel.nack(msg, false, false);
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
            await this.ensureReady();
            // ensure exchange exists
            // await this.channel.assertExchange(exchange, type, { durable: true, });

            // amqp is binary protocol on tcp so send in binary format
            const buffer = Buffer.from(JSON.stringify(message));

            // publish message
            this.channel.publish(exchange, routingKey, buffer, {
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
            // close channel + connection
            await this.channel?.close();
            await this.connection?.close();

            this.logger.log("RabbitMQ connection closed");
        } catch (error) {
            this.logger.error("Error closing RabbitMQ connection:", error);
        }
    }
}