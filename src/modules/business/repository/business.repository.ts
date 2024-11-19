import { Repository } from 'typeorm';
import { CustomRepository } from '../../../typeorm-extension';
import { BusinessProfile } from '../entities';
import { CreateBusinessProfileDto } from '../dto/create-business-profile.dto';
import { FilterBusinessesDto } from '../dto/filter-business.dto';
import { PaginationDto, PaginationMetadataDto, PaginationResultDto } from 'src/queries/dto';
import { PageMetaDtoParameters } from 'src/interfaces';
import { dayOrderMap } from '../types/order-bookingHours';

@CustomRepository(BusinessProfile)
export class BusinessRepository extends Repository<BusinessProfile> {
  async createBusiness(createBusiness: CreateBusinessProfileDto): Promise<BusinessProfile> {
    const businessProfile = this.create(createBusiness);
    return await this.save(businessProfile);
  }

  async findOneById(id: string): Promise<BusinessProfile> {
    return this.findOne({
      where: { id },
      relations: [
        'services',
        'bookingHours',
        'staff',
        'owner',
        'reviews',
        'announcements',
        'paymentInformation',
      ],
    });
  }
  async findOneBusiness(id: string): Promise<BusinessProfile> {
    const businessProfile = await this.createQueryBuilder('businessProfile')
      .leftJoinAndSelect('businessProfile.bookingHours', 'bookingHours')
      .leftJoinAndSelect('businessProfile.paymentInformation', 'paymentInformation')
      .leftJoinAndMapOne(
        'businessProfile.owner',
        'businessProfile.owner',
        'owner',
        'owner.id = businessProfile.ownerId'
      )
      .addSelect(['owner.emailAddress', 'owner.phoneNumber'])
      .where('businessProfile.id = :id', { id })
      .getOne();

    businessProfile.bookingHours = businessProfile.bookingHours.sort((a, b) => {
      return dayOrderMap[a.day] - dayOrderMap[b.day];
    });

    return businessProfile;
  }
  async findBusinesses(
    filterDto: FilterBusinessesDto,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    const { categories, minRating, maxRating, latitude, longitude, maxDistance, searchQuery } =
      filterDto;
    const { order, limit, skip } = paginationDto;

    const maxDistanceKm = maxDistance ?? 5;
    const maxDistanceMeters = maxDistanceKm * 1000;

    const query = this.createQueryBuilder('businessProfile')
      .leftJoinAndSelect('businessProfile.services', 'serviceDetails')
      .leftJoinAndSelect('businessProfile.bookingHours', 'bookingHours')
      .leftJoinAndSelect('businessProfile.announcements', 'announcements')
      .leftJoin('businessProfile.reviews', 'reviews')
      .addSelect('AVG(reviews.rating)', 'averageRating')
      .addSelect('COUNT(reviews.id)', 'reviewCount')
      .groupBy('businessProfile.id')
      .addGroupBy('serviceDetails.id')
      .addGroupBy('bookingHours.id')
      .addGroupBy('announcements.id');

    if (Array.isArray(categories) && categories.length) {
      query.andWhere('businessProfile.businessCategory && :categories', { categories });
    }

    if (minRating !== undefined) {
      query.having('AVG(reviews.rating) >= :minRating', { minRating });
    }

    if (maxRating !== undefined) {
      query.having('AVG(reviews.rating) <= :maxRating', { maxRating });
    }

    if (latitude !== undefined && longitude !== undefined) {
      query.andWhere(
        `ST_DWithin("businessProfile"."coordinates"::geography, ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography, :maxDistanceMeters)`,
        { longitude, latitude, maxDistanceMeters }
      );
    }

    if (searchQuery) {
      query.andWhere(
        `(businessProfile.businessName ILIKE :searchQuery
      OR businessProfile.businessAddress ILIKE :searchQuery
      OR businessProfile.description ILIKE :searchQuery
      OR businessProfile.about ILIKE :searchQuery
      OR serviceDetails.serviceName ILIKE :searchQuery)`,
        { searchQuery: `%${searchQuery}%` }
      );
    }

    query.orderBy('businessProfile.createdAt', order).skip(skip).take(limit);
    const { raw, entities } = await query.getRawAndEntities();

    const data = entities.map((business, index) => {
      const sortedBookingHours = business.bookingHours.sort((a, b) => {
        return dayOrderMap[a.day] - dayOrderMap[b.day];
      });

      return {
        ...business,
        bookingHours: sortedBookingHours,
        averageRating: raw[index].averageRating
          ? parseFloat(raw[index].averageRating).toFixed(1)
          : '0.0',
        reviewCount: parseInt(raw[index].reviewCount, 10),
        reviews: business.reviews,
      };
    });

    const pageMetaDtoParameters: PageMetaDtoParameters = {
      pageOptionsDto: paginationDto,
      itemCount: entities.length,
    };

    const meta = new PaginationMetadataDto(pageMetaDtoParameters);

    return new PaginationResultDto(data, meta);
  }

  async findAllByUserId(
    userId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    const { order, limit, skip } = paginationDto;

    const query = this.createQueryBuilder('businessProfile')
      .leftJoinAndSelect('businessProfile.bookingHours', 'bookingHours')
      .leftJoinAndSelect('businessProfile.services', 'serviceDetails')
      .leftJoin('businessProfile.owner', 'owner')
      .addSelect(['owner.id', 'owner.firstName', 'owner.lastName'])
      .where('businessProfile.owner.id = :userId', { userId })
      .orderBy('businessProfile.createdAt', order)
      .skip(skip)
      .take(limit);

    const [data, itemCount] = await query.getManyAndCount();

    const sortedData = data.map(businessProfile => {
      businessProfile.bookingHours = businessProfile.bookingHours.sort((a, b) => {
        return dayOrderMap[a.day] - dayOrderMap[b.day];
      });
      return businessProfile;
    });
    const pageMetaDtoParameters: PageMetaDtoParameters = {
      pageOptionsDto: paginationDto,
      itemCount,
    };

    const meta = new PaginationMetadataDto(pageMetaDtoParameters);

    return new PaginationResultDto(sortedData, meta);
  }

  async updateBusiness(
    businessId: string,
    updateBusinessProfileDto: Partial<BusinessProfile>
  ): Promise<void> {
    await this.update(businessId, updateBusinessProfileDto);
  }

  async saveBusinessProfile(businessProfile: BusinessProfile) {
    return await this.save(businessProfile);
  }
  async findUsersFavoriteBusinesses(userId: string) {
    return await this.find({
      where: { favorites: { user: { id: userId } } },
      relations: ['favorites'],
    });
  }

  async getDefaultBusinesses(
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    const defaultLimit = paginationDto.limit ?? 5;
    paginationDto.limit = defaultLimit;

    const query = this.createQueryBuilder('businessProfile')
      .leftJoinAndSelect('businessProfile.services', 'serviceDetails')
      .leftJoinAndSelect('businessProfile.bookingHours', 'bookingHours')
      .leftJoin('businessProfile.reviews', 'reviews')
      .addSelect('COALESCE(AVG(reviews.rating), 0)', 'averageRating')
      .addSelect('COUNT(reviews.id)', 'reviewCount')
      .groupBy('businessProfile.id')
      .addGroupBy('serviceDetails.id')
      .addGroupBy('bookingHours.id')
      .orderBy('businessProfile.createdAt', 'DESC')
      .take(defaultLimit);

    const result = await query.getRawAndEntities();

    const entities = result.entities;
    const rawResults = result.raw;

    const businessesWithRatings = entities.map((business, index) => ({
      ...business,
      averageRating: parseFloat(rawResults[index].averageRating).toFixed(1),
      reviewCount: parseInt(rawResults[index].reviewCount, 10),
    }));

    const pageMetaDtoParameters: PageMetaDtoParameters = {
      pageOptionsDto: paginationDto,
      itemCount: entities.length,
    };

    const meta = new PaginationMetadataDto(pageMetaDtoParameters);

    return new PaginationResultDto(businessesWithRatings, meta);
  }
}
