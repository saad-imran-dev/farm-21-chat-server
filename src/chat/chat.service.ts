import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';
import { Repository } from 'typeorm';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly repository: Repository<Chat>,
  ) {}

  async get(chatId: string): Promise<Chat> {
    return this.repository.findOneBy({
      id: chatId,
    });
  }

  async getAll(user: string): Promise<Chat[]> {
    return this.repository.find({
      where: [
        { sender: user },
        { receiver: user }
      ],
      order: { createdAt: 'ASC' },
    });
  }

  async create(
    sender: string,
    receiver: string,
    message: string,
  ): Promise<Chat> {
    const chat = this.repository.create({
      sender,
      receiver,
      message,
      createdAt: Date.now(),
      received: false,
    });
    await this.repository.save([chat]);
    return this.repository.findOneBy(chat);
  }

  async unreceivedMessages(receiver: string): Promise<Chat[]> {
    return this.repository.find({
      where: { receiver, received: false },
      order: { createdAt: 'ASC' },
    });
  }

  async receive(chatId: string): Promise<Chat> {
    const updateResult = await this.repository.update(chatId, {
      received: true,
    });
    const chat: Chat = await this.get(chatId);
    await this.repository.save([chat]);
    return chat;
  }
}
