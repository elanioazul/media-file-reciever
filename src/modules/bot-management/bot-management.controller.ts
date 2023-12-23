import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { Response } from 'express';
import { catchError, tap } from 'rxjs/operators';
import { BotMessage } from './interfaces/bot-message.interface';
import { of } from 'rxjs';
@Controller('api/telegram')
export class BotManagementController {
  constructor(private telegramService: TelegramService) {}
  @Post()
  async process(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: BotMessage,
  ) {
    try {
      this.telegramService
        .handleMessage(body)
        .pipe(
          // tap((data) => {
          //   console.log('Successful processing telegram messages:', data);
          // }),
          catchError((error) => {
            console.error('Error in handleMessage:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
              message: 'An error occurred while processing the message.',
              error: error?.response?.data,
            });
            return of(null);
          }),
        )
        .subscribe();
      return res.send().status(200);
    } catch (error) {
      console.error('Error outside stream:', error);
    }
  }
}
