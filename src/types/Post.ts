import { IUser } from './User';
import { IDealType } from './DealType';

export interface IPost {
  _id: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  creator: IUser;
  dealType: IDealType;
  description: string;
  images: string[];
  name: string;
  price: number;
  productCharacters: {
    _id: string;
    roomsQuantity: IDealType;
    totalArea_sq_m: number;
  };
  propertyType: IDealType;
}

export interface INewPostPayload {
  name: string;
  address: string;
  price: string;
  dealType: string;
  propertyType: string;
  region: string;
  city?: string;
  cityArea?: string;
  productCharacter: {
    roomsQuantity?: string;
    rentalType: string;
    floor?: string;
    constructionYear?: string;
    bedsQuantity?: string;
    totalArea_sq_m?: number;
    studio?: boolean;
    inNewBuilding?: boolean;
    bathroom?: string;
    balcony?: string;
    propertyCondition?: string;
    ceilingHeight?: string;
    levelsNumber?: string;
    repair?: string;
    wallMaterial?: string;
    storeysNumber?: string;
    homeInfrastructure?: string;
    inBathroom?: string;
    inKitchen?: string;
    lifeArrangement?: string;
  };
}
