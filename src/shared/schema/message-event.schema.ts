import { IsString, IsUUID } from 'class-validator';

export class MessageEventSchema {
  @IsUUID()
  receiver: string;

  @IsString()
  message: string;
}
