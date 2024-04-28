import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([Chat])],
  providers: [ChatService],
})
export class ChatModule {}
