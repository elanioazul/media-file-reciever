import { Multer } from 'multer';
import { IsString } from 'class-validator';
import { OwnerDto } from './owner.dto';

export class TreeCamFiletDto extends OwnerDto {
  file?: Multer['single'];
}
