import { Injectable } from '@nestjs/common';
import { WsException, WsResponse } from '@nestjs/websockets';
import { AuthService } from 'src/auth/auth.service';
import { Chat } from 'src/chat/chat.entity';
import { ChatService } from 'src/chat/chat.service';
import { RedisService } from 'src/redis/redis.service';
import { Events } from 'src/shared/enums/events.enum';
import { Fields } from 'src/shared/enums/fields.enum';
import { IWsUnreceivedResponse } from '../shared/interface/IWsUnreceivedResponse';
import { IWsAllMessagesResponse } from '../shared/interface/IWsAllMessagesResponse';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  private Map: Record<string, string> = {};

  constructor(
    private readonly authService: AuthService,
    private readonly redisService: RedisService,
    private readonly chatService: ChatService,
  ) {}

  async register(client: any) {
    const jwt: any = this.authService.validateClient(
      client.handshake.headers.authorization,
    );

    await this.redisService.set(jwt.userId, {
      [Fields.JWT]: jwt,
      [Fields.SOCKET_ID]: client.id,
    });
    client.decoded = jwt;
  }

  async unRegister(client: any) {
    if (client.decoded) {
      const userId: string = client.decoded.userId;
      await this.redisService.remove(userId);
    }
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

  async receiveMessage(client: any, data: any): Promise<void> {
    const chat: Chat = await this.chatService.get(data.chatId);
    if (!chat) throw new WsException('Chat message does not exist');
    if (client.decoded.userId !== chat.receiver)
      throw new WsException('Not authorized to receive chat message');

    const receivedChat: Chat = await this.chatService.receive(data.chatId);
  }

  async allMessages(client: any): Promise<IWsAllMessagesResponse> {
    const clientId: string = client.decoded.userId;
    const messages: Chat[] = await this.chatService.getAll(clientId);

    // Group messages according to users
    let messagesByUser: Record<string, Chat[]> = {};
    messages.forEach((chat) => {
      const user: string =
        chat.sender === clientId ? chat.receiver : chat.sender;
      user in messagesByUser
        ? messagesByUser[user].push(chat)
        : (messagesByUser[user] = [chat]);
    });

    return {
      event: Events.AllMessages,
      data: messagesByUser,
    };
  }
}
