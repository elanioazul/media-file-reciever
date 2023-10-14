import { IsString, IsNumber, IsBoolean } from 'class-validator';
import { CameraDto } from './camera.dto';

export class OwnerDto extends CameraDto {
  @IsString()
  ownerName: string;

  @IsString()
  ownerSurname: string;

  @IsString()
  ownerDni: string;

  @IsString()
  ownerTelegramUser: string;

  @IsString()
  ownerPhone: string;

  @IsString()
  ownerEmail: string;
}
