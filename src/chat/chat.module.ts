import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from './chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Chat])],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
