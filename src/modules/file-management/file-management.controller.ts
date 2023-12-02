import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { FileManagementService } from './file-management.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import * as path from 'path';
import { TreeCamFiletDto } from './dto/treecam-file.dto';
import { CreateTreeCamFileResponse } from './classes/creation-response';
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
      res.contentType(found.mimetype);
    } catch (error) {
      res.status(404).send('File not found');
    }
  }

  @Post('single')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req: Request, file, callback) => {
          const generateCustomFilename = (
            file,
            ownerName,
            ownerSurname,
            camAlias,
          ) => {
            const getFirstChar = (word: string): string => {
              return word.substring(0, 1).toUpperCase();
            };
            const filenameWithoutExtension = file.originalname
              .split('.')
              .slice(0, -1)
              .join('.');
            return (
              `${Date.now()}` +
              '-' +
              getFirstChar(ownerName) +
              getFirstChar(ownerSurname) +
              '-' +
              camAlias +
              '-' +
              `${filenameWithoutExtension}`
            );
          };
          const storageObj: TreeCamFiletDto = req.body as TreeCamFiletDto;
          const customFileName = generateCustomFilename(
            file,
            storageObj.ownerName,
            storageObj.ownerSurname,
            storageObj.camAlias,
          );
          callback(null, customFileName);
        },
      }),
    }),
  )
  async upload(
    @Body() storageObjDto: TreeCamFiletDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
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
