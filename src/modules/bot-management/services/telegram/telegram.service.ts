import { Injectable } from '@nestjs/common';
import { AxioshttpService } from 'src/modules/providers/services/http/axioshttp/axioshttp.service';
import { BotMessage } from '../../interfaces/bot-message.interface';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

const sendMessageApiMethod = '/sendMessage';
const sendPhotoApiMethod = '/sendPhoto';
const sendDocumentApiMethod = '/sendDocument';

const telegramBotsUrl = 'https://api.telegram.org/bot';
const myToken = process.env.BOT_TOKEN;
const BASE_URL = telegramBotsUrl + myToken;

const formHeaders = { 'Content-Type': 'multipart/form-data' };
const regularHeaders = { 'Content-Type': 'application/json' };

const ngrokUrl = 'https://e46b-2-138-160-33.ngrok-free.app';

@Injectable()
export class TelegramService {
  constructor(private axiosService: AxioshttpService) {}

  public sendMessage(
    origenMessage: BotMessage,
    apiMethod: string,
    outMessage: string,
  ): Observable<AxiosResponse<BotMessage>> {
    return this.axiosService.doNestsAxiosGet(BASE_URL, apiMethod, {
      chat_id: origenMessage.message.chat.id,
      text: outMessage,
    });
  }

  public handleMessage(message: BotMessage): Observable<any> {
    const messagetext = message.message.text || '';

    if (messagetext.charAt(0) == '/') {
      const command = messagetext.substring(1);
      switch (command) {
        case 'start':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'I can help you out how to start',
          );

        default:
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'I don´t now that commnad',
          );
      }
    } else {
      //send back the same message to bot user
      return this.sendMessage(message, sendMessageApiMethod, messagetext);
    }
  }

  manageFile(
    ownerTelegramUser: string,
    mimetype: string,
    originalname: string,
    path: string,
  ): Observable<AxiosResponse<BotMessage>> {
    const chatId = ownerTelegramUser;
    const params = {
      chat_id: chatId,
      caption: originalname,
    };

    if (mimetype.startsWith('video')) {
      return this.handleVideo(params, path);
    } else if (mimetype.startsWith('image')) {
      return this.handlePhoto(params, path);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  handlePhoto(params: any, path: string): Observable<any> {
    params['photo'] = ngrokUrl + '/' + path;

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendPhotoApiMethod,
      params,
      {
        headers: regularHeaders,
      },
    );
  }
  handleVideo(params: any, path: string): Observable<any> {
    params['document'] = ngrokUrl + '/' + path;

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendDocumentApiMethod,
      params,
      {
        headers: regularHeaders,
      },
    );
  }
}
