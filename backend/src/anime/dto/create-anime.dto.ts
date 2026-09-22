import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { AnimeStatus } from '../enums/anime-status.enum';

export class CreateAnimeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsEnum(AnimeStatus)
  status: AnimeStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startedAt?: Date | null;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  finishedAt?: Date | null;
}
