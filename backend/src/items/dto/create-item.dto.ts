import { IsBoolean, IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombre!: string;

  @IsInt()
  @Min(0)
  cantidad!: number;

  @IsBoolean()
  activo!: boolean;
}
