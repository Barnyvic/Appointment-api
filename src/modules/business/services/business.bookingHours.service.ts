import { Injectable } from '@nestjs/common';
import { UpdateBusinessHoursDto } from '../dto/update-booking-hour.dto';
import { BookingHours } from '../entities/booking-hours.entity';
import { ErrorHelper } from 'src/utils/error.utils';
import { BookingHoursRepository } from '../repository/businessHour.repository';

@Injectable()
export class BookingHoursService {
  constructor(private readonly bookingHoursRepository: BookingHoursRepository) {}

  async updateBookingHours(
    bookingHoursId: string,
    updateBusinessHoursDto: UpdateBusinessHoursDto
  ): Promise<BookingHours> {
    const bookingHours = await this.bookingHoursRepository.findOneBookingHours(bookingHoursId);

    if (!bookingHours) {
      ErrorHelper.NotFoundException(`Booking hours with ID "${bookingHoursId}" not found`);
    }

    const updatedBookingHour = await this.bookingHoursRepository.updateBookingHours(
      bookingHoursId,
      updateBusinessHoursDto
    );
    return updatedBookingHour;
  }
}
