import { ServiceOffering, TeamSize, BusinessCategory, Currency } from 'src/modules/business/enum';
import { Point } from 'typeorm';

export interface FavoriteDto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  businessName: string;
  businessAddress: string;
  serviceOffering: ServiceOffering[];
  about: string | null;
  description: string | null;
  teamSize: TeamSize;
  businessCategory: BusinessCategory[];
  coordinates: Point;
  instagramLink: string | null;
  facebookLink: string | null;
  twitterLink: string | null;
  tiktokLink: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  businessImage: string[] | null;
  businessCurrency: Currency;
  businessLogo: string | null;
  averageRating: string;
  reviewCount: number;
}
