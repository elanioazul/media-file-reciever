import { Module } from '@nestjs/common';
import { BotManagementController } from './bot-management.controller';
import { ProvidersModule } from '../providers/providers.module';
import { TelegramService } from './services/telegram/telegram.service';
import { TelegramAccount } from './entities/telegram-account';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [BotManagementController],
  imports: [ProvidersModule, TypeOrmModule.forFeature([TelegramAccount])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class BotManagementModule {}
