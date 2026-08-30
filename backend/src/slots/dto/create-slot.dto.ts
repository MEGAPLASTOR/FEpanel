import { IsNumber, IsString } from 'class-validator';

export class CreateSlotDto {
  @IsString()
  ownerId!: string;

  @IsString()
  name!: string;

  @IsString()
  minecraftVersion!: string;

  @IsString()
  loader!: string;

  @IsString()
  serverHost!: string;

  @IsNumber()
  serverPort!: number;

  @IsNumber()
  ramLimit!: number;

  @IsNumber()
  cpuLimit!: number;

  @IsNumber()
  diskLimit!: number;
}
