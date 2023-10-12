import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { camDto } from './camera.dto';

export class camOwner extends camDto {
  @IsString()
  name: string;

  @IsString()
  surname: string;

  @IsString()
  dni: string;

  @IsString()
  telegramUser: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;
}
