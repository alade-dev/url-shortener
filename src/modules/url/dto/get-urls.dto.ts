import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetUrlsDto {
  @IsOptional()
  filter?: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @Min(1)
  page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number;
}
