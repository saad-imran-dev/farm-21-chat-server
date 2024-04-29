import { Chat } from 'src/chat/chat.entity';
import { Events } from 'src/utils/enums/events.enum';

export interface IWsUnreceivedResponse {
  event: Events;
  data: Chat[];
}
