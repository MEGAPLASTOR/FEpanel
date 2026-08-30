import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateNodeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  ip?: string;

  @IsNumber()
  @IsOptional()
  port?: number;

  @IsString()
  @IsOptional()
  secretKey?: string;

  @IsString()
  @IsOptional()
  os?: string;

  @IsNumber()
  @IsOptional()
  maxSlots?: number;

  @IsString()
  @IsOptional()
  status?: string;
}
