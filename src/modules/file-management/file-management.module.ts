import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';
import { TelegramAccount } from '../bot-management/entities/telegram-account';
import { BotManagementModule } from '../bot-management/bot-management.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([TreeCamFile, Camera, Owner, TelegramAccount]),
    BotManagementModule,
  ],
  providers: [FileManagementService],
  controllers: [FileManagementController],
})
export class FileManagementModule {}
