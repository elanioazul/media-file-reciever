import { Test, TestingModule } from '@nestjs/testing';
import { PhotographersController } from './photographers.controller';
import { PhotographersService } from './photographers.service';

describe('PhotographersController', () => {
  let controller: PhotographersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhotographersController],
      providers: [PhotographersService],
    }).compile();

    controller = module.get<PhotographersController>(PhotographersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
