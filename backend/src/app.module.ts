import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { authdataSource } from './module/auth-server/infrastructure/database/data-source';
import { UserModule } from './module/auth-server/feature/user/user.module';
import { BcryptService } from './common/services/bcrypt.service';
import { UserRepository } from './module/auth-server/infrastructure/repository/user.repo';
import { JwtHelperService } from './module/auth-server/infrastructure/services/jwt.service';
import { RabbitMQModule } from './common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './common/infrastruture/middleware/authenticate.middleware';
import { mailDataSource } from './module/mail-server/infrastructure/database/data-source';
import { CronModule } from './module/mail-server/infrastructure/cron/cron.module';
import { MailModule } from './module/mail-server/infrastructure/email/mail.module';

@Module({
  imports: [
    // common
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_REGISTER_SECRET,
      // signOptions: { expiresIn: '60m' },
    }),
    RabbitMQModule,

    //Auth Modules
    UserModule,
    TypeOrmModule.forRoot({
      name: 'auth',
      ...authdataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),

    //Mail Modules
    TypeOrmModule.forRoot({
      name: 'mail',
      ...mailDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    MailModule,
    CronModule
  ],
  controllers: [AppController],
  providers: [AppService, BcryptService, UserRepository, JwtHelperService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticateMiddleware)
      .exclude(
        { path: '/user/login', method: RequestMethod.ALL },
        { path: '/user/register', method: RequestMethod.ALL },
      )
      .forRoutes('*');
  }
}