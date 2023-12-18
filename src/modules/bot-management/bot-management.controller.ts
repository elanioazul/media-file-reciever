import { Controller, Get, Post, Req, Body, Res } from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { Response } from 'express';
import { catchError } from 'rxjs/operators';
import { BotMessage } from './interfaces/bot-message.interface';
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
          catchError((error) => {
            throw `An error happened. Msg: ${JSON.stringify(
              error?.response?.data,
            )}`;
          }),
        )
        .subscribe((data) => {
          console.log(data);
        });
      return res.send().status(200);
    } catch (error) {
      console.log(error);
    }
  }
}
