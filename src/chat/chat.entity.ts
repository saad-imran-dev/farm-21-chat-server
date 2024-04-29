import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  sender: string;

  @Column()
  receiver: string;

  @Column()
  message: string;

  @Column('bigint', { default: Date.now() })
  createdAt: number;

  @Column('boolean', { default: false })
  received: boolean;
}