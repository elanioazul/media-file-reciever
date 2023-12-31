import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Req,
  Get,
  Param,
  HttpStatus,
  Res,
  HttpException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { FileManagementService } from './file-management.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer, diskStorage } from 'multer';
import * as path from 'path';
import { TreeCamFiletDto } from './dto/treecam-file.dto';
import { CreateTreeCamFileResponse } from './classes/creation-response';
import { TelegramService } from '../bot-management/services/telegram/telegram.service';
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
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Unable to determine the directory for the file requested');
    }
    try {
      const found = await this.fileManagementService.findOne(id);
      const physicalFilePath = path.join(dirname, '/' + found.path);
      res.sendFile(physicalFilePath);
      res.contentType(found.mimetype);
    } catch (error) {
      if (error.name === 'EntityNotFoundException') {
        return res.status(HttpStatus.NOT_FOUND).send('File not found');
      }

      // Log other types of errors for debugging purposes
      console.error(error);

      // Generic error response
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Failed to process the file requested. Please try again later.');
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
      limits: {
        fileSize: 1024 * 1024 * 10, // Set a reasonable limit, for example, 10 MB
      },
    }),
  )
  async upload(
    @Body() storageObjDto: TreeCamFiletDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const createdTreecamFile = await this.fileManagementService.create(
        storageObjDto,
        file,
      );

      return new CreateTreeCamFileResponse(
        'TreeCamFile created successfully',
        createdTreecamFile,
      );
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Internal Server Error uploading file',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
