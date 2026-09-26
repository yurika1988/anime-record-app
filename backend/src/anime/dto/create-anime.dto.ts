import { Transform, Type } from 'class-transformer';
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

const emptyToNull = ({ value }: { value: unknown }) =>
  value === '' ? null : value;

export class CreateAnimeDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @Transform(emptyToNull)
  @IsString()
  description?: string | null;

  @IsOptional()
  @Transform(emptyToNull)
  @IsString()
  imageUrl?: string | null;

  @IsEnum(AnimeStatus)
  status: AnimeStatus;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined ? undefined : value,
  )
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
