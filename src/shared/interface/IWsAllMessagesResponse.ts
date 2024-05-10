import { Chat } from 'src/chat/chat.entity';
import { Events } from 'src/shared/enums/events.enum';

export interface IWsAllMessagesResponse {
  event: Events.AllMessages;
  data: Record<string, Chat[]>;
}
