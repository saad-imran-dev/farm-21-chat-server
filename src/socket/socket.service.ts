import { Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { Chat } from 'src/chat/chat.entity';
import { ChatService } from 'src/chat/chat.service';
import { RedisService } from 'src/redis/redis.service';
import { Events } from 'src/utils/enums/events.enum';
import { Fields } from 'src/utils/enums/fields.enum';
import { IWsChatResponse } from './interface/IWsChatResponse';
import { IWsUnreceivedResponse } from './interface/IWsUnreceivedResponse';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private Map: Record<string, string> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
  ) {}

  register(client: any) {
    const jwt: any = this.authService.validateClient(
      client.handshake.headers.authorization,
    );

    this.redisService.set(jwt.userId, {
      [Fields.JWT]: jwt,
      [Fields.SOCKET_ID]: client.id,
    });
    client.decoded = jwt;
  }

  unRegister(client: any) {
    const userId: string = client.decoded.userId;
    this.redisService.remove(userId);
  }

  async ping(client: any): Promise<WsResponse> {
    const data = (await this.redisService.get(client.decoded.userId))[
      Fields.SOCKET_ID
    ];
    return {
      event: Events.Pong,
      data,
    };
  }

  async message(server: Server, client: any, data: any): Promise<void> {
    if (data.receiver === client.decoded.userId)
      throw new WsException("Can't send message to self");

    const user = await this.redisService.get(data.receiver);
    const chat: Chat = await this.chatService.create(
      client.decoded.userId,
      data.receiver,
      data.message,
    );
    
    if (user) {
      server.to(user[Fields.SOCKET_ID]).emit(Events.Message, chat);
    }
  }

  async unreceivedMessages(client: any): Promise<IWsUnreceivedResponse> {
    const messages: Chat[] = await this.chatService.unreceivedMessages(
      client.decoded.userId,
    );
    return {
      event: Events.UnreceivedMessages,
      data: messages,
    };
  }

  async recieveMessage(client: any, data: any): Promise<void> {
    const chat: Chat = await this.chatService.receive(data.chatId);
  }
}
