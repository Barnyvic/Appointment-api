/* eslint-disable prefer-const */
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { BusinessRepository } from '../repository/business.repository';
import { CreateBusinessProfileDto } from '../dto/create-business-profile.dto';
import { GoogleMapsService } from '../../googlemaps/googlemaps.service';
import { Point } from 'geojson';
import { FilterBusinessesDto } from '../dto/filter-business.dto';
import { BusinessProfile } from '../entities';
import { PaginationDto, PaginationMetadataDto, PaginationResultDto } from 'src/queries/dto';
import { ErrorHelper } from 'src/utils';
import { UpdateBusinessProfileDto } from '../dto/update-business.dto';
import { UsersService } from '../../users/users.service';
import { AppointmentsService } from 'src/modules/appointments/service/appointments.service';
import { NotificationService } from 'src/modules/notifications/notification.service';
import { NotificationType, PageMetaDtoParameters } from 'src/interfaces';
import { BookingHoursService } from './business.bookingHours.service';
import { BusinessCategory } from '../enum';
import { Appointment } from 'src/modules/appointments/entities';

@Injectable()
export class BusinessService {
  constructor(
    private readonly businessRepository: BusinessRepository,
    private readonly googleMapsService: GoogleMapsService,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly notificationService: NotificationService,
    private readonly bookingHoursService: BookingHoursService
  ) {}

  async createBusinessProfile(createBusinessProfileDto: CreateBusinessProfileDto) {
    try {
      const { businessAddress } = createBusinessProfileDto;
      const coordinates = await this.googleMapsService.getCoordinates(businessAddress);

      // Create a GeoJSON Point
      const point: Point = {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      };
      // Create a new business profile with the coordinates
      const businessProfile = this.businessRepository.create({
        ...createBusinessProfileDto,
        coordinates: point,
      });

      return await this.businessRepository.createBusiness(businessProfile);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to create business profile: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to create business profile: Server Error');
      }
    }
  }

  async findOneBusiness(businessId: string) {
    try {
      const business = await this.businessRepository.findOneBusiness(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }
      const { owner, ...businessData } = business;
      return {
        ...businessData,
        emailAddress: owner.emailAddress,
        phoneNumber: owner.phoneNumber,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to find business: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to find business: Server Error');
      }
    }
  }

  async findAllBusinesses(
    filterDto: FilterBusinessesDto,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    try {
      const businessesPaginated = await this.businessRepository.findBusinesses(
        filterDto,
        paginationDto
      );
      return businessesPaginated;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to fetch businesses: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to fetch businesses: Server Error');
      }
    }
  }

  async findAllByUserId(
    userId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    try {
      return await this.businessRepository.findAllByUserId(userId, paginationDto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to fetch businesses by user ID: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException(
          'Failed to fetch businesses by user ID: Server Error'
        );
      }
    }
  }

  async findBusiness(businessId: string): Promise<BusinessProfile> {
    try {
      const business = await this.businessRepository.findOneById(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }
      return business;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to find business: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to find business: Server Error');
      }
    }
  }

  async updateBusinessProfile(
    businessId: string,
    updateBusinessProfileDto: UpdateBusinessProfileDto
  ) {
    try {
      const existingBusiness = await this.findBusiness(businessId);
      if (!existingBusiness) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }

      const {
        businessAddress,
        country,
        state,
        city,
        zipCode,
        businessLogo,
        businessImage,
        currency,
      } = updateBusinessProfileDto;
      let updatedFields = [];

      if (businessAddress && businessAddress !== existingBusiness.businessAddress) {
        const coordinates = await this.googleMapsService.getCoordinates(businessAddress);
        existingBusiness.coordinates = {
          type: 'Point',
          coordinates: [coordinates.longitude, coordinates.latitude],
        };
        existingBusiness.businessAddress = businessAddress;
        updatedFields.push('Business Address');
      }

      const { businessName, businessCategory, description } = updateBusinessProfileDto;
      if (businessName && businessName !== existingBusiness.businessName) {
        existingBusiness.businessName = businessName;
        updatedFields.push('Business Name');
      }

      if (businessCategory && businessCategory.length > 0) {
        existingBusiness.businessCategory = businessCategory;
        updatedFields.push('Business Category');
      }

      if (description && description !== existingBusiness.description) {
        existingBusiness.description = description;
        updatedFields.push('Description');
      }

      if (country && country !== existingBusiness.country) {
        existingBusiness.country = country;
        updatedFields.push('Country');
      }

      if (state && state !== existingBusiness.state) {
        existingBusiness.state = state;
        updatedFields.push('State');
      }

      if (city && city !== existingBusiness.city) {
        existingBusiness.city = city;
        updatedFields.push('City');
      }

      if (zipCode && zipCode !== existingBusiness.zipCode) {
        existingBusiness.zipCode = zipCode;
        updatedFields.push('Zip Code');
      }

      if (businessLogo && businessLogo !== existingBusiness.businessLogo) {
        existingBusiness.businessLogo = businessLogo;
        updatedFields.push('Business Logo');
      }

      if (currency && currency !== existingBusiness.businessCurrency) {
        existingBusiness.businessCurrency = currency;
        updatedFields.push('Business Currency');
      }

      if (
        businessImage &&
        JSON.stringify(businessImage) !== JSON.stringify(existingBusiness.businessImage)
      ) {
        existingBusiness.businessImage = businessImage;
        updatedFields.push('Business Image');
      }

      // Update social links and payment information
      const { contactInformation, paymentInformation } = updateBusinessProfileDto;
      if (contactInformation) {
        if (contactInformation.instagramLink) {
          existingBusiness.instagramLink = contactInformation.instagramLink;
          updatedFields.push('Instagram');
        }
        if (contactInformation.facebookLink) {
          existingBusiness.facebookLink = contactInformation.facebookLink;
          updatedFields.push('Facebook');
        }
        if (contactInformation.twitterLink) {
          existingBusiness.twitterLink = contactInformation.twitterLink;
          updatedFields.push('Twitter');
        }
        if (contactInformation.tiktokLink) {
          existingBusiness.tiktokLink = contactInformation.tiktokLink;
          updatedFields.push('TikTok');
        }

        if (contactInformation.phoneNumber || contactInformation.email) {
          const { emailCheck, phoneCheck } = await this.usersService.checkIfUserExist(
            contactInformation.email,
            contactInformation.phoneNumber
          );

          if (emailCheck && existingBusiness.owner.emailAddress !== contactInformation.email) {
            ErrorHelper.ConflictException('User with Email already exists');
          }

          if (phoneCheck && existingBusiness.owner.phoneNumber !== contactInformation.phoneNumber) {
            ErrorHelper.ConflictException('User with Phone already exists');
          }

          await this.usersService.update(existingBusiness.owner.id, {
            emailAddress: contactInformation.email,
            phoneNumber: contactInformation.phoneNumber,
          });
        }
      }

      if (paymentInformation) {
        existingBusiness.paymentInformation = {
          ...existingBusiness.paymentInformation,
          ...paymentInformation,
        };
        updatedFields.push('Payment Information');
      }

      await this.businessRepository.saveBusinessProfile(existingBusiness);

      const { openingHours } = updateBusinessProfileDto;

      if (openingHours && openingHours.length > 0) {
        for (const hoursDto of openingHours) {
          await this.bookingHoursService.updateBookingHours(hoursDto.id, hoursDto);
        }
      }

      if (updatedFields.length > 0) {
        await this.notificationService.queueNotification({
          userId: existingBusiness.owner.id,
          type: NotificationType.PROFILE_UPDATE,
          metadata: { updatedFields },
        });
      }

      return this.findBusiness(businessId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to update business profile: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to update business profile: Server Error');
      }
    }
  }

  async deleteSocialMediaHandle(businessId: string, handle: string) {
    try {
      const business = await this.findBusiness(businessId);
      if (!business) {
        ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
      }
      switch (handle) {
        case 'instagram':
          business.instagramLink = null;
          break;
        case 'facebook':
          business.facebookLink = null;
          break;
        case 'twitter':
          business.twitterLink = null;
          break;
        case 'tiktok':
          business.tiktokLink = null;
          break;
        default:
          ErrorHelper.BadRequestException(`Invalid social media handle: "${handle}"`);
      }

      await this.businessRepository.save(business);
      return business;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to delete social media handle: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException(
          'Failed to delete social media handle: Server Error'
        );
      }
    }
  }

  async getBusinessAppointmentsByStatus(businessId: string) {
    try {
      return await this.appointmentsService.getBusinessAppointmentsByStatus(businessId);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to fetch appointments: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to fetch appointments: Server Error');
      }
    }
  }

  async recommendBusinessesForUser(
    userId: string,
    userLocation: Point | null,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<BusinessProfile>> {
    try {
      const favorites = await this.businessRepository.findUsersFavoriteBusinesses(userId);

      const favoriteCategories = favorites.reduce((acc, business) => {
        business.businessCategory.forEach(category => {
          const enumCategory = BusinessCategory[category as keyof typeof BusinessCategory];
          if (enumCategory && !acc.includes(enumCategory)) {
            acc.push(enumCategory);
          }
        });
        return acc;
      }, [] as BusinessCategory[]);

      // Validate userLocation coordinates
      const isValidLocation =
        userLocation &&
        Array.isArray(userLocation.coordinates) &&
        userLocation.coordinates.length === 2 &&
        !isNaN(userLocation.coordinates[0]) &&
        !isNaN(userLocation.coordinates[1]);

      if (favoriteCategories.length === 0 && !isValidLocation) {
        const data = await this.businessRepository.getDefaultBusinesses(paginationDto);
        return data;
      }

      const uniqueBusinesses = new Map<string, BusinessProfile>();

      for (const category of favoriteCategories) {
        const recommendations = await this.businessRepository.findBusinesses(
          {
            categories: [category],
            latitude: isValidLocation ? userLocation.coordinates[1] : undefined,
            longitude: isValidLocation ? userLocation.coordinates[0] : undefined,
            maxDistance: isValidLocation ? 5 : undefined,
          },
          paginationDto
        );

        recommendations.data.forEach(business => {
          if (!uniqueBusinesses.has(business.id)) {
            uniqueBusinesses.set(business.id, business);
          }
        });
      }

      const uniqueBusinessArray = Array.from(uniqueBusinesses.values());

      const pageMetaDtoParameters: PageMetaDtoParameters = {
        pageOptionsDto: paginationDto,
        itemCount: uniqueBusinessArray.length,
      };

      const meta = new PaginationMetadataDto(pageMetaDtoParameters);
      const paginatedResult = new PaginationResultDto(uniqueBusinessArray, meta);

      return paginatedResult;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to fetch recommendations: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to fetch recommendations: Server Error');
      }
    }
  }

  // 1. Get a list of customers for a specific business
  async findAllCustomers(
    businessId: string,
    paginationDto: PaginationDto
  ): Promise<PaginationResultDto<Appointment>> {
    const business = await this.findBusiness(businessId);
    if (!business) {
      ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
    }

    return await this.appointmentsService.findAllCustomersByBusinessId(businessId, paginationDto);
  }

  // 4. Get appointment history for a specific customer within a business
  async getCustomerAppointments(businessId: string, customerId: string): Promise<Appointment[]> {
    const business = await this.findBusiness(businessId);
    if (!business) {
      ErrorHelper.NotFoundException(`Business with ID "${businessId}" not found`);
    }

    return await this.appointmentsService.findAppointmentsByCustomerAndBusiness(
      businessId,
      customerId
    );
  }
}
