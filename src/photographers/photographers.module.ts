import { Module } from '@nestjs/common';
import { PhotographersService } from './photographers.service';
import { PhotographersController } from './photographers.controller';

@Module({
  controllers: [PhotographersController],
  providers: [PhotographersService]
})
export class PhotographersModule {}
