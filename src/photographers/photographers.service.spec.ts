import { Test, TestingModule } from '@nestjs/testing';
import { PhotographersService } from './photographers.service';

describe('PhotographersService', () => {
  let service: PhotographersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhotographersService],
    }).compile();

    service = module.get<PhotographersService>(PhotographersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
