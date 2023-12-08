import { Test, TestingModule } from '@nestjs/testing';
import { AxioshttpService } from './axioshttp.service';

describe('AxioshttpService', () => {
  let service: AxioshttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AxioshttpService],
    }).compile();

    service = module.get<AxioshttpService>(AxioshttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
