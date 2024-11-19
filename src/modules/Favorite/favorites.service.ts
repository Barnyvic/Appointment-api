import { Injectable } from '@nestjs/common';
import { FavoriteRepository } from './respository/favorite.respository';

@Injectable()
export class FavoritesService {
  constructor(private readonly favoriteRepository: FavoriteRepository) {}

  async addFavorite(userId: string, businessProfileId: string) {
    return this.favoriteRepository.addFavorite(userId, businessProfileId);
  }

  async removeFavorite(userId: string, businessProfileId: string) {
    return this.favoriteRepository.removeFavorite(userId, businessProfileId);
  }

  async getFavoritesByUser(userId: string) {
    return this.favoriteRepository.findFavoritesByUser(userId);
  }
}
