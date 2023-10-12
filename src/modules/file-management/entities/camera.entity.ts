import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TreeCamFile } from 'src/modules/file-management/entities/treecam-file.entity';
import { Owner } from './owner.entity';

@Entity('cameras')
export class Camera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  hasLocationFeat: boolean;

  @OneToMany(() => TreeCamFile, (file) => file.camera)
  photos: TreeCamFile[];

  @ManyToOne(() => Owner, (owner) => owner.camera, {
    cascade: ['insert'],
  })
  @JoinColumn({ name: 'owner_id' })
  owner: Owner;
}
