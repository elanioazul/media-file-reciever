import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CameraDto {
  @IsString()
  camAlias: string;

  @IsString()
  camBrand: string;

  @IsString()
  camModel: string;

  @IsString()
  camHasGeoCapabilities: string;
}
