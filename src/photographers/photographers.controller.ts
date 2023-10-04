import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PhotographersService } from './photographers.service';
import { CreatePhotographerDto } from './dto/create-photographer.dto';
import { UpdatePhotographerDto } from './dto/update-photographer.dto';

@Controller('photographers')
export class PhotographersController {
  constructor(private readonly photographersService: PhotographersService) {}

  @Post()
  create(@Body() createPhotographerDto: CreatePhotographerDto) {
    return this.photographersService.create(createPhotographerDto);
  }

  @Get()
  findAll() {
    return this.photographersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.photographersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePhotographerDto: UpdatePhotographerDto) {
    return this.photographersService.update(+id, updatePhotographerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.photographersService.remove(+id);
  }
}
