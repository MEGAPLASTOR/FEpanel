import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateNodeDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  ip!: string;

  @IsNumber()
  @IsNotEmpty()
  port!: number;

  @IsString()
  @IsNotEmpty()
  secretKey!: string;

  @IsString()
  @IsOptional()
  os?: string; // e.g. "Windows 10"

  @IsNumber()
  @IsOptional()
  maxSlots?: number;
}
