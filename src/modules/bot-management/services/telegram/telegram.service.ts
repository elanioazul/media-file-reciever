import { Injectable } from '@nestjs/common';
import { AxioshttpService } from 'src/modules/providers/services/http/axioshttp/axioshttp.service';
import { BotMessage, Chat } from '../../interfaces/bot-message.interface';
import { Observable, catchError, from, of, switchMap, throwError } from 'rxjs';
import { AxiosResponse } from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { TelegramAccount } from '../../entities/telegram-account';
import { Repository } from 'typeorm';
import { ITelegramAccount } from '../../interfaces/telegram-account.interfaz';

const sendMessageApiMethod = '/sendMessage';
const sendPhotoApiMethod = '/sendPhoto';
const sendDocumentApiMethod = '/sendDocument';

const telegramBotsUrl = 'https://api.telegram.org/bot';
const myToken = process.env.BOT_TOKEN;
const BASE_URL = telegramBotsUrl + myToken;

const CHAT_ID = process.env.CHAT_ID;

const filesFileEndpoint = '/api/files/file/';

const regularHeaders = { 'Content-Type': 'application/json' };

const ngrokUrl = 'https://f443-2-138-160-33.ngrok-free.app';

@Injectable()
export class TelegramService {
  constructor(
    private axiosService: AxioshttpService,
    @InjectRepository(TelegramAccount)
    private readonly telegramRepository: Repository<TelegramAccount>,
  ) {}

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
        case 'registration':
          return this.handleRegistration(message.message.chat).pipe(
            switchMap((telegramAccount: ITelegramAccount) => {
              if (telegramAccount.isNewlyCreated) {
                return this.sendMessage(
                  message,
                  sendMessageApiMethod,
                  'Registration success',
                );
              } else {
                return this.sendMessage(
                  message,
                  sendMessageApiMethod,
                  'You are already a registered user',
                );
              }
            }),
          );

        case 'mycameras':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'Info related to your cameras is not implemented yet',
          );

        case 'ranking':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'Accounting of files managed by the app is not implemented yet',
          );

        case 'help':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            `
            This is a bot about your treecams.\n
            Type predefined commands to interact
            `,
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
    mimetype: string,
    originalname: string,
    fileName: string,
  ): Observable<AxiosResponse<BotMessage>> {
    const chatId = CHAT_ID;
    const params = {
      chat_id: chatId,
      caption: originalname,
    };

    if (mimetype.startsWith('video')) {
      return this.handleVideo(params, fileName);
    } else if (mimetype.startsWith('image')) {
      return this.handlePhoto(params, fileName);
    } else {
      throw new Error('Unsupported file type');
    }
  }

  handlePhoto(params: any, fileName: string): Observable<any> {
    params['photo'] = ngrokUrl + filesFileEndpoint + fileName;

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendPhotoApiMethod,
      params,
      {
        headers: regularHeaders,
      },
    );
  }
  handleVideo(params: any, fileName: string): Observable<any> {
    params['document'] = ngrokUrl + filesFileEndpoint + fileName;

    return this.axiosService.doNestAxiosPost(
      BASE_URL,
      sendDocumentApiMethod,
      params,
      {
        headers: regularHeaders,
      },
    );
  }

  private handleRegistration(userChat: Chat): Observable<TelegramAccount> {
    return from(
      this.telegramRepository.findOne({
        // where: [
        //   { chat_id: userChat.id },
        //   { username: userChat.username },
        //   { first_name: userChat.first_name },
        // ],
        where: { username: userChat.username },
      }),
    ).pipe(
      switchMap((existingAccount) => {
        if (existingAccount) {
          return of({ ...existingAccount, isNewlyCreated: false });
        }

        const newAccount = this.telegramRepository.create({
          chat_id: userChat.id.toString(),
          username: userChat.username,
          first_name: userChat.first_name,
          last_name: userChat.last_name,
          type: 'private',
        });

        return from(this.telegramRepository.save(newAccount)).pipe(
          catchError((error) => {
            return throwError(() => error);
          }),
          switchMap(() => of({ ...newAccount, isNewlyCreated: true })),
        );
      }),
      catchError((error) => throwError(() => error)),
    );
  }
}
