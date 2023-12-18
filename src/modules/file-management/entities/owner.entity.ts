import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Camera } from './camera.entity';
import { TelegramAccount } from 'src/modules/bot-management/entities/telegram-account';

@Entity('cameraowners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column()
  dni: string;

  @OneToOne(() => TelegramAccount)
  @JoinColumn({ name: 'telegramaccount_id' })
  telegram: TelegramAccount;

  @Column()
  email: string;

  @Column()
  phone: string;

  @OneToMany(() => Camera, (camera) => camera.owner)
  cameras: Camera[];
}
