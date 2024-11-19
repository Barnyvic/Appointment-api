import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-extension';
import { Favorite } from '../entities/favorites.entity';
import { FavoriteDto } from '../dto/favorite.dto';

@CustomRepository(Favorite)
export class FavoriteRepository extends Repository<Favorite> {
  async addFavorite(userId: string, businessProfileId: string): Promise<Favorite> {
    const favorite = this.create({
      user: { id: userId },
      businessProfile: { id: businessProfileId },
    });
    return this.save(favorite);
  }

  async removeFavorite(userId: string, businessProfileId: string): Promise<void> {
    await this.delete({ user: { id: userId }, businessProfile: { id: businessProfileId } });
  }

  async findFavoritesByUser(userId: string): Promise<FavoriteDto[]> {
    const favorites = await this.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.businessProfile', 'businessProfile')
      .leftJoinAndSelect('businessProfile.services', 'services')
      .leftJoinAndSelect('businessProfile.bookingHours', 'bookingHours')
      .leftJoin('businessProfile.reviews', 'reviews')
      .addSelect('AVG(reviews.rating)', 'averageRating')
      .addSelect('COUNT(reviews.id)', 'reviewCount')
      .where('favorite.userId = :userId', { userId })
      .groupBy('favorite.id')
      .addGroupBy('businessProfile.id')
      .addGroupBy('services.id')
      .addGroupBy('bookingHours.id')
      .getRawAndEntities();

    return favorites.entities.map((favorite, index): FavoriteDto => {
      const raw = favorites.raw[index];
      return {
        id: favorite.id,
        createdAt: favorite.createdAt,
        updatedAt: favorite.updatedAt,
        deletedAt: favorite.deletedAt,
        ...favorite.businessProfile,
        averageRating: parseFloat(raw.averageRating).toFixed(1) || '0.0',
        reviewCount: parseInt(raw.reviewCount, 10) || 0,
      };
    });
  }
}
