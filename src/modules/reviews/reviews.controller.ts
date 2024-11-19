import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { User } from 'src/decorators';
import { AuthGuard } from 'src/guards';
import { IUser } from 'src/interfaces';
import { Review } from './entities/review.entity';
import { HttpResponse } from 'src/utils';
import { ReviewSortOptions } from './enums';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post(':businessId')
  @UseGuards(AuthGuard)
  async createReview(
    @Param('businessId') businessId: string,
    @Body() createReviewDto: CreateReviewDto,
    @User() user: IUser
  ) {
    const userId = user.id;
    const data = await this.reviewsService.createReview(businessId, createReviewDto, userId);
    return HttpResponse.success({
      data,
      message: 'review created successfully',
    });
  }

  @Get('business/:businessId')
  async getReviewsByBusiness(
    @Param('businessId') businessId: string,
    @Query('sortBy') sortBy: ReviewSortOptions = ReviewSortOptions.MOST_RELEVANT,
    @Query('rating') rating?: number
  ) {
    const data = await this.reviewsService.getReviewsByBusiness(businessId, sortBy, rating);
    return HttpResponse.success({
      data,
      message: 'reviews retrieved successfully',
    });
  }

  @Get('user/:userId')
  async getReviewsByUser(@Param('userId') userId: string): Promise<Review[]> {
    return this.reviewsService.getReviewsByUser(userId);
  }
}
