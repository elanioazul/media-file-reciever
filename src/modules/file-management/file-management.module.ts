import { Module } from '@nestjs/common';
import { FileManagementService } from './file-management.service';
import { FileManagementController } from './file-management.controller';

@Module({
  providers: [FileManagementService],
  controllers: [FileManagementController],
})
export class FileManagementModule {}
