import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BrevoService } from './brevo.service';

@Module({
  imports: [HttpModule],
  providers: [BrevoService],
  exports: [BrevoService],
})
export class BrevoModule {}
