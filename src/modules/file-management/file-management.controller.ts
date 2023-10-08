import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { Express } from 'express';
import { FileManagementService } from './file-management.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

const generateFilename = (file) => {
  return `${Date.now()}.${extname(file.originalname)}`;
};

@Controller('api/files')
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  // @Post('/multiple')
  // @UseInterceptors(FilesInterceptor('files'))
  // async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
  //   const req = {
  //     files,
  //     prospectId: 1234,
  //   };
  //   return await this.appService.getUrls(req);
  // }

  // @Post('/single')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   const req = {
  //     files: [file],
  //     prospectId: 1234,
  //   };
  //   return await this.appService.getUrls(req);
  // }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the field being passed
      { storage },
    ),
  )
  async upload(@Req() request: Request, @UploadedFile() file: Multer) {
    console.log(request);

    console.log(file);
    console.log('uploadeddddddddddddddddddd');

    return file;
  }
}
