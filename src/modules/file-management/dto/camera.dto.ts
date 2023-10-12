import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class camDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsString()
  hasGeoCapabilities: string;
}
