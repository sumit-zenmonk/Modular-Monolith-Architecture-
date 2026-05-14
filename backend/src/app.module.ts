import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { authdataSource } from './module/auth-server/infrastructure/database/data-source';
import { BcryptService } from './common/services/bcrypt.service';
import { UserRepository } from './module/auth-server/infrastructure/repository/user.repo';
import { JwtHelperService } from './module/auth-server/infrastructure/services/jwt.service';
import { RabbitMQModule } from './common/infrastruture/rabbit-mq/rabbit-mq.module';
import { AuthenticateMiddleware } from './common/infrastruture/middleware/authenticate.middleware';
import { mailDataSource } from './module/mail-server/infrastructure/database/data-source';
import * as MailCronModule from './module/mail-server/infrastructure/cron/cron.module';
import * as AuthCronModule from './module/auth-server/infrastructure/cron/cron.module';
import * as MainCronModule from './module/main-server/infrastructure/cron/cron.module';
import { MailModule } from './module/mail-server/infrastructure/email/mail.module';
import * as AuthModule from './module/auth-server/feature/user/user.module';
import * as MainModule from './module/main-server/feature/user/user.module';
import { PostModule } from './module/main-server/feature/post/post.module';
import { FollowModule } from './module/main-server/feature/follow/follow.module';
import { mainDataSource } from './module/main-server/infrastructure/database/data-source';
import { ScheduleModule } from '@nestjs/schedule';

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
    ScheduleModule.forRoot(),

    //Auth Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_AUTH_SCHEMA || 'auth',
      ...authdataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    AuthModule.UserModule,
    AuthCronModule.CronModule,

    //Mail Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_MAIL_SCHEMA || 'mail',
      ...mailDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    MailModule,
    MailCronModule.CronModule,

    // Main Modules
    TypeOrmModule.forRoot({
      name: process.env.DB_POSTGRES_MAIN_SCHEMA || 'main',
      ...mainDataSource.options,
      retryAttempts: 10,
      retryDelay: 5000
    }),
    MainModule.UserModule,
    PostModule,
    FollowModule,
    MainCronModule.CronModule,
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