import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { SocketModule } from './socket/socket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisAsyncOptions } from './utils/configuration/redis.constants';
import { RedisModule } from './redis/redis.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseAsyncOptions } from './utils/configuration/database.constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(databaseAsyncOptions),
    CacheModule.registerAsync(redisAsyncOptions),
    ConfigModule.forRoot({ isGlobal: true }),
    ChatModule,
    AuthModule,
    SocketModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
