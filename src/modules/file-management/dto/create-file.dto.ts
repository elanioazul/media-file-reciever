import { IsString, IsNumber, IsDateString, IsDate } from 'class-validator';
export class TreeCamFileDto {
  @IsString()
  readonly file_name: string;

  @IsString()
  readonly file_type: string;

  @IsNumber()
  readonly size: number;

  @IsString()
  readonly uuid?: string;

  @IsString()
  readonly system_name?: string;

  @IsDate()
  readonly data: string;
}
