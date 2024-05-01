import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { RedisModule } from 'src/redis/redis.module';
import { ChatModule } from 'src/chat/chat.module';
import { ExceptionsModule } from 'src/exceptions/exceptions.module';

@Module({
  imports: [AuthModule, RedisModule, ChatModule, ExceptionsModule],
  providers: [SocketService, SocketGateway],
})
export class SocketModule {}
