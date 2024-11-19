import { CustomRepository } from 'src/typeorm-extension';
import { Repository } from 'typeorm';
import { BookingHours } from '../entities/booking-hours.entity';
import { UpdateBusinessHoursDto } from '../dto/update-booking-hour.dto';

@CustomRepository(BookingHours)
export class BookingHoursRepository extends Repository<BookingHours> {
  async updateBookingHours(
    bookingHoursId: string,
    updateBusinessHoursDto: UpdateBusinessHoursDto
  ): Promise<BookingHours> {
    const bookingHours = await this.findOneBookingHours(bookingHoursId);
    Object.assign(bookingHours, updateBusinessHoursDto);
    return this.save(bookingHours);
  }

  async findOneBookingHours(id: string): Promise<BookingHours> {
    return this.findOne({ where: { id }, relations: ['businessProfile'] });
  }
}
