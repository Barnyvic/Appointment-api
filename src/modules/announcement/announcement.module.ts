import { Module } from '@nestjs/common';
import { TypeOrmExModule } from 'src/typeorm-extension';
import { AnnouncementRepository } from './announcement.repository';
import { AnnouncementService } from './announcement.service';
import { AnnouncementController } from './announcement.controller';
import { BusinessModule } from '../business/business.module';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([AnnouncementRepository]), BusinessModule],
  providers: [AnnouncementService],
  controllers: [AnnouncementController],
  exports: [AnnouncementService],
})
export class AnnouncementModule {}
