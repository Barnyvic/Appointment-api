import { CustomRepository } from '../../typeorm-extension';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewSortOptions } from './enums';

@CustomRepository(Review)
export class ReviewRepository extends Repository<Review> {
  async createReview(review: Review): Promise<Review> {
    return await this.save(review);
  }

  async findReviewsByBusiness(
    businessProfileId: string,
    sortBy: ReviewSortOptions = ReviewSortOptions.MOST_RELEVANT,
    rating?: number
  ): Promise<Review[]> {
    let query = this.createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.businessProfile.id = :businessProfileId', { businessProfileId });

    if (rating) {
      query = query.andWhere('review.rating = :rating', { rating });
    }

    switch (sortBy) {
      case ReviewSortOptions.LATEST:
        query = query.orderBy('review.createdAt', 'DESC');
        break;
      case ReviewSortOptions.HIGHEST:
        query = query.orderBy('review.rating', 'DESC');
        break;
      case ReviewSortOptions.LOWEST:
        query = query.orderBy('review.rating', 'ASC');
        break;
      case ReviewSortOptions.MOST_RELEVANT:
      default:
        // Assuming relevance is based on the date and rating combined.
        query = query.orderBy('review.createdAt', 'DESC').addOrderBy('review.rating', 'DESC');
        break;
    }

    return await query.getMany();
  }

  async findReviewsByUser(userId: string): Promise<Review[]> {
    return this.find({ where: { user: { id: userId } }, relations: ['businessProfile'] });
  }

  async averageRatingOfABusiness(businessId: string) {
    return await this.createQueryBuilder('review')
      .select('AVG(review.rating)', 'average')
      .where('review.businessProfile.id = :businessId', { businessId })
      .getRawOne()
      .then(result => parseFloat(result.average || 0));
  }
}
