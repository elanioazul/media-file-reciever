import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { File } from 'src/modules/file-management/entities/file.entity';
export class Camera {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  num_serie: string;

  @Column()
  hasLocationFeat: boolean;

  @Column()
  owner: number;

  @OneToMany(() => File, (file) => file.camera)
  photos: File[];
}
