import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Camera } from './camera.entity';

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

  @Column()
  telegram_account: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @OneToMany(() => Camera, (camera) => camera.owner)
  camera: Camera[];
}
