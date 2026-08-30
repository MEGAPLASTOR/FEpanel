import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateSlotDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  minecraftVersion?: string;

  @IsOptional()
  @IsString()
  loader?: string;

  @IsOptional()
  @IsString()
  serverHost?: string;

  @IsOptional()
  @IsNumber()
  serverPort?: number;

  @IsOptional()
  @IsNumber()
  ramLimit?: number;

  @IsOptional()
  @IsNumber()
  cpuLimit?: number;

  @IsOptional()
  @IsNumber()
  diskLimit?: number;
}
