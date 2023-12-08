import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';
import { BotManagementModule } from '../bot-management/bot-management.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TreeCamFile, Camera, Owner]),
    BotManagementModule,
  ],
  providers: [FileManagementService],
  controllers: [FileManagementController],
})
export class FileManagementModule {}
