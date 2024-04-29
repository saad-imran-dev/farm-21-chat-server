import { Chat } from 'src/chat/chat.entity';
import { Events } from 'src/utils/enums/events.enum';

export interface IWsChatResponse {
  event: Events;
  data: Chat;
}
