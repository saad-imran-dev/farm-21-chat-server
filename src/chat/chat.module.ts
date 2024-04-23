import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatService]
})
export class ChatModule {}
