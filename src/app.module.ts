import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigifyModule } from '@itgorillaz/configify';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { PrimaryDbConfiguration } from './configuration/primary-db.config';
import { UserModule } from './app/user/user.module';
import { CategoryModule } from './app/category/category.module';
import { OptionModule } from './app/option/option.module';
import { QuestionModule } from './app/question/question.module';
import { AnswerModule } from './app/answer/answer.module';
import { UserSubmittedAnswerModule } from './app/user_submitted_answer/user_submitted_answer.module'; // Import the new module
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { SMTPEmailConfiguration } from './configuration/smtp.config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { AuthModule } from './app/auth/auth.module';
import { RedisModule } from './app/redis/redis.module'; // Import the Redis module
import { JwtModule } from '@nestjs/jwt';
import { AppConfiguration } from './configuration/app.config';
import { BullModule } from '@nestjs/bullmq';
import { RedisCacheConfiguration } from './configuration/redis-cache.config';
import { ExcelProcessor } from './app/question/queue/question.queue.processor';

@Module({
  imports: [
    ConfigifyModule.forRootAsync(),
    EventEmitterModule.forRoot({wildcard: true, delimiter: '.'}),
    MongooseModule.forRootAsync({
      inject: [PrimaryDbConfiguration],
      useFactory: async (primaryDbConfiguration: PrimaryDbConfiguration) => {
        return {
          uri: primaryDbConfiguration.DB_CONNECTION_STRING
        };
      },
    }),
    MailerModule.forRootAsync({
      imports: [ConfigifyModule],
      useFactory: (smtpEmailConfiguration: SMTPEmailConfiguration) => ({
        transport: {
          host: smtpEmailConfiguration.EMAIL_SMTP_SERVER,
          port:parseInt(smtpEmailConfiguration.EMAIL_SMTP_PORT),
          secure: false, 
          auth: {
            user: smtpEmailConfiguration.EMAIL_SMTP_USER,
            pass: smtpEmailConfiguration.EMAIL_SMTP_PASSWORD
          }
        },
        template: {
          dir: join(__dirname, '..', 'views', 'email-template'),
          adapter: new EjsAdapter({ inlineCssEnabled: true }),
          options: {
            strict: false,
          },
        },
      }),
      inject: [SMTPEmailConfiguration],
    }),
    JwtModule.registerAsync({
      imports: [ConfigifyModule],
      inject: [AppConfiguration],
      global: true,
      useFactory: async (appConfiguration: AppConfiguration) =>(
        {
          secret: appConfiguration.APP_JWT_TOKEN_PVT_KEY,
          signOptions: { expiresIn: '2d' },
        }
      ),
    }),
    BullModule.forRootAsync({
      imports: [ConfigifyModule],
      inject: [RedisCacheConfiguration],
      useFactory: async (redisCacheConfiguration: RedisCacheConfiguration) => ({
        connection: {
          host: redisCacheConfiguration.REDIS_HOST,
          port: Number(redisCacheConfiguration.REDIS_PORT),
          db: Number(redisCacheConfiguration.REDIS_DATABASE),
        },
      }),
    }),
    RedisModule,
    AuthModule,
    UserModule,
    CategoryModule,
    OptionModule,
    QuestionModule,
    AnswerModule,
    UserSubmittedAnswerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
