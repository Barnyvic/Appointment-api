import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { UsersModule } from '../users/users.module';
import { BusinessModule } from '../business/business.module';
import { FavoriteRepository } from './respository/favorite.respository';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([FavoriteRepository]), UsersModule, BusinessModule],
  controllers: [FavoritesController],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
