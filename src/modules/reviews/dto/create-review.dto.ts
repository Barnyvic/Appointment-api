import { IsString, Min, Max, IsNumber } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  reviewText: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  rating: number;
}
