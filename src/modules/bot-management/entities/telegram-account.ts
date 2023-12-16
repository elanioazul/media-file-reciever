import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('telegramaccounts')
export class TelegramAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  chat_id: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column({ default: 'private' })
  type: string;
}
