import { Controller, Post, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from 'src/guards';
import { User } from 'src/decorators';
import { IUser } from 'src/interfaces';
import { HttpResponse } from 'src/utils';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':businessId')
  @UseGuards(AuthGuard)
  async addFavorite(@Param('businessId') businessId: string, @User() user: IUser) {
    const data = await this.favoritesService.addFavorite(user.id, businessId);
    return HttpResponse.success({
      data,
      message: 'Business added to favorites successfully',
    });
  }

  @Delete(':businessId')
  @UseGuards(AuthGuard)
  async removeFavorite(@Param('businessId') businessId: string, @User() user: IUser) {
    await this.favoritesService.removeFavorite(user.id, businessId);
    return HttpResponse.success({
      data: null,
      message: 'Business removed from favorites successfully',
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getFavorites(@User() user: IUser) {
    const data = await this.favoritesService.getFavoritesByUser(user.id);
    return HttpResponse.success({
      data,
      message: 'Favorites retrieved successfully',
    });
  }
}
