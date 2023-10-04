import { Injectable } from '@nestjs/common';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';

@Injectable()
export class PhotographersService {
  create(createPhotographerDto: CreatePhotographerDto) {
    return 'This action adds a new photographer';
  }

  findAll() {
    return `This action returns all photographers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} photographer`;
  }

  update(id: number, updatePhotographerDto: UpdatePhotographerDto) {
    return `This action updates a #${id} photographer`;
  }

  remove(id: number) {
    return `This action removes a #${id} photographer`;
  }
}
