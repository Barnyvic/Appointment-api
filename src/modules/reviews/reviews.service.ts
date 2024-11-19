import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { BusinessService } from '../business/services/business.service';
import { UsersService } from '../users/users.service';
import { ReviewRepository } from './reviews.repository';
import { ErrorHelper } from 'src/utils';
import { Review } from './entities/review.entity';
import { ReviewSortOptions } from './enums';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly usersService: UsersService,
    private readonly businessService: BusinessService
  ) {}
  async createReview(
    businessProfileId: string,
    createReviewDto: CreateReviewDto,
    userId: string
  ): Promise<Review> {
    const business = await this.businessService.findBusiness(businessProfileId);
    if (!business) {
      ErrorHelper.BadRequestException('Business not found');
    }

    const user = await this.usersService.getUserById(userId);
    if (!user) {
      ErrorHelper.BadRequestException('User not found');
    }

    const review = new Review();
    review.reviewText = createReviewDto.reviewText;
    review.rating = createReviewDto.rating;
    review.businessProfile = business;
    review.user = user;

    const createdReview = await this.reviewRepository.createReview(review);

    return createdReview;
  }

  async getReviewsByBusiness(
    businessProfileId: string,
    sortBy: ReviewSortOptions,
    rating?: number
  ): Promise<Review[]> {
    return this.reviewRepository.findReviewsByBusiness(businessProfileId, sortBy, rating);
  }

  async getReviewsByUser(userId: string): Promise<Review[]> {
    return this.reviewRepository.findReviewsByUser(userId);
  }

  async getAverageRatingOfABusiness(businessId: string) {
    return await this.reviewRepository.averageRatingOfABusiness(businessId);
  }
}
