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

const filesFileEndpoint = '/api/files/file/';

const regularHeaders = { 'Content-Type': 'application/json' };

const ngrokUrl = 'https://66ce-213-27-229-66.ngrok-free.app';

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
                  'Registro realizado con éxito',
                );
              } else {
                return this.sendMessage(
                  message,
                  sendMessageApiMethod,
                  'Eres ya un usuario registrado',
                );
              }
            }),
          );

        case 'mycameras':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'Información a cerca de sus cámaras sin implementar todavía',
          );

        case 'ranking':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'Contabilidad de files gestionados por la app no implementada todavía',
          );

        case 'help':
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            `
            Esto es un bot sobre stand-tree cameras. Escribe alguno de los comandos disponibles.
            `,
          );

        default:
          return this.sendMessage(
            message,
            sendMessageApiMethod,
            'Desconozco ese comando',
          );
      }
    } else {
      //send back the same message to bot user
      return this.sendMessage(message, sendMessageApiMethod, messagetext);
    }
  }

  manageFile(
    mimetype: string,
    fileName: string,
    chatId: string,
  ): Observable<AxiosResponse<BotMessage>> {
    const params = {
      chat_id: chatId,
      caption: fileName,
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
