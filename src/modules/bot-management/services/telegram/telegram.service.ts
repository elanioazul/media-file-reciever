import { Injectable } from '@nestjs/common';
import { AxioshttpService } from 'src/modules/providers/services/http/axioshttp/axioshttp.service';
import { BotMessage } from '../../interfaces/bot-message.interface';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';

const sendMessageApiMethod = '/sendMessage';
const sendPhotoApiMethod = '/sendPhoto';
const sendDocumentApiMethod = '/sendDocument';

const telegramBotsUrl = 'https://api.telegram.org/bot';
const myToken = process.env.BOT_TOKEN;
const BASE_URL = telegramBotsUrl + myToken;

const formHeaders = { 'Content-Type': 'multipart/form-data' };

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
    file: Express.Multer.File,
  ): Observable<AxiosResponse<BotMessage>> {
    const formData = new FormData();
    const chatId = ownerTelegramUser;

    formData.append('chat_id', chatId);
    formData.append('caption', file.originalname);

    if (file.mimetype.startsWith('video')) {
      return this.handleVideo(formData, file);
    } else if (file.mimetype.startsWith('image')) {
      return this.handlePhoto(formData, file);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  handlePhoto(formData: FormData, file: Express.Multer.File): Observable<any> {
    formData.append('photo', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendPhotoApiMethod,
      formData,
      {
        headers: formHeaders,
      },
    );
  }
  handleVideo(formData: FormData, file: Express.Multer.File): Observable<any> {
    formData.append('document', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendDocumentApiMethod,
      formData,
      {
        headers: formHeaders,
      },
    );
  }
}
