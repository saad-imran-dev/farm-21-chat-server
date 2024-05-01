import { IsUUID } from 'class-validator';

export class ReceiveEventSchema {
  @IsUUID()
  chatId: string;
}
