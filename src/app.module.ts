import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisAsyncOptions } from './shared/configuration/redis.constants';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseAsyncOptions } from './shared/configuration/database.constants';
import { ExceptionsModule } from './exceptions/exceptions.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseAsyncOptions),
    CacheModule.registerAsync(redisAsyncOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    AuthModule,
    SocketModule,
    RedisModule,
    ExceptionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
