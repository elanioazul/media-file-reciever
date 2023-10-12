import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class camDto {
  @IsString()
  alias: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  numSerie: number;

  @IsBoolean()
  hasGeoCapabilities: boolean;
}
