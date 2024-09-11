import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from '../middlewares/logger.middleware';
// import { redisProvider } from './cache/redis.provider';
// import { CacheModule } from '@nestjs/cache-manager';
import { MemberModule } from './member/member.module';
import { TaskModule } from './task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV
        ? `.${process.env.NODE_ENV}.env`
        : '.env',
    }),
    MongooseModule.forRoot(process.env.DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
    }),
    MemberModule,
    TaskModule,
    // CacheModule.register({
    //   redisProvider,
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
