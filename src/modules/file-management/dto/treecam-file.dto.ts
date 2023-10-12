import { Multer } from 'multer';
import { camOwner } from './owner.dto';

export class TreeCamFiletDto extends camOwner {
  file: Multer['single'];
}
