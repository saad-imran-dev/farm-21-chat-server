import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [AuthModule, RedisModule, ChatModule],
  providers: [SocketController, SocketService, SocketGateway]
})
export class SocketModule {}
