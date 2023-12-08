import { Module } from '@nestjs/common';
import { BotManagementController } from './bot-management.controller';
import { ProvidersModule } from '../providers/providers.module';
import { TelegramService } from './services/telegram/telegram.service';

@Module({
  controllers: [BotManagementController],
  imports: [ProvidersModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class BotManagementModule {}
