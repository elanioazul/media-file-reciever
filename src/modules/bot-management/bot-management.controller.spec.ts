import { Test, TestingModule } from '@nestjs/testing';
import { BotManagementController } from './bot-management.controller';

describe('BotManagementController', () => {
  let controller: BotManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BotManagementController],
    }).compile();

    controller = module.get<BotManagementController>(BotManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
