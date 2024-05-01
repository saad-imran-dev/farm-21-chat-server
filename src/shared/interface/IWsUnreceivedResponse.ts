import { Chat } from 'src/chat/chat.entity';
import { Events } from 'src/shared/enums/events.enum';

export interface IWsUnreceivedResponse {
  event: Events;
  data: Chat[];
}
