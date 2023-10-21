import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  UploadedFile,
  Req,
  Get,
  Query,
  Param,
  Res,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { FileManagementService } from './file-management.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage, DiskStorageOptions } from 'multer';
import * as path from 'path';
import { TreeCamFiletDto } from './dto/treecam-file.dto';
import { CreateTreeCamFileResponse } from './classes/creation-response';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    callback(null, generateFilename(file));
  },
});

const generateFilename = (file) => {
  return `${Date.now()}` + '-' + `${file.originalname}`;
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

  @Get('file/:id')
  async find(@Res() res: Response, @Param('id') id: string): Promise<any> {
    const dirname = path.resolve();
    if (!dirname) {
      return res
        .status(500)
        .send('Unable to determine the current working directory.');
    }
    try {
      const found = await this.fileManagementService.findOne(id);
      const physicalFilePath = path.join(dirname, '/' + found.path);
      res.sendFile(physicalFilePath);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Post('single')
  @UseInterceptors(
    FileInterceptor(
      'file', // name of the html field being passed
      { storage },
    ),
  )
  async upload(
    @Body() storageObjDto: TreeCamFiletDto,
    @UploadedFile() file: Multer['single'],
  ) {
    const createdTreecamFile = await this.fileManagementService.create(
      storageObjDto,
      file,
    );

    return new CreateTreeCamFileResponse(
      'TreeCamFile created successfully',
      createdTreecamFile,
    );
  }
}
