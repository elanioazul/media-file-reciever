import { Controller, Get, Post, Req, Body, Res } from '@nestjs/common';
import { TelegramService } from './services/telegram/telegram.service';
import { Response } from 'express';
import { catchError } from 'rxjs/operators';
@Controller('api/telegram')
export class BotManagementController {
  constructor(private telegramService: TelegramService) {}
  @Post()
  async process(@Req() req: Request, @Res() res: Response, @Body() body) {
    // console.log(req.body);
    console.log(body);
    return res.send('fuck yeaah 200').status(200);

    // try {
    //   const data = await this.telegramService.handleMessage(body).pipe(
    //     catchError((error) => {
    //       throw `An error happened. Msg: ${JSON.stringify(
    //         error?.response?.data,
    //       )}`;
    //     }),
    //   );
    //   return data;
    // } catch (error) {
    //   console.log(error);
    // }
    //res.send(this.telegramService.handleMessage(body));
  }
}
