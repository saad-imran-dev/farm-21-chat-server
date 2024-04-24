import { Module } from '@nestjs/common';
import { SocketController } from './socket.controller';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketController, SocketService, SocketGateway]
})
export class SocketModule {}
