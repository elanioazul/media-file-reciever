import { PartialType } from '@nestjs/mapped-types';
import { CreatePhotographerDto } from './create-photographer.dto';

export class UpdatePhotographerDto extends PartialType(CreatePhotographerDto) {}
