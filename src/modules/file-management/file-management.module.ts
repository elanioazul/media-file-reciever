import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TreeCamFile } from './entities/treecam-file.entity';
import { Camera } from './entities/camera.entity';
import { Owner } from './entities/owner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TreeCamFile, Camera, Owner])],
  providers: [FileManagementService],
  controllers: [FileManagementController],
})
export class FileManagementModule {}
