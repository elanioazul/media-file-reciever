import { Camera } from 'src/modules/file-management/entities/camera.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('treecamfiles')
export class TreeCamFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalname: string;

  @Column()
  filename: string;

  @Column()
  filepath: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @ManyToOne(() => Camera, (camera) => camera.files, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'camera_id' })
  camera: Camera;

  @CreateDateColumn({ name: 'created_at' })
  createdDate: Date;

  @CreateDateColumn({
    name: 'created_at_detailed1',
    type: 'timestamp with time zone',
  })
  createdTimeStampWithTimeZone: Date;

  @CreateDateColumn({
    name: 'created_at_detailed2',
    type: 'timestamp without time zone',
  })
  createdTimeStampWithNoTimeZone: Date;

  @CreateDateColumn({
    name: 'created_at_detailed3',
    type: 'timestamp',
  })
  createdTimeStamp: Date;
}
