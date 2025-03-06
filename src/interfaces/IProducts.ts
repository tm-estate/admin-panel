import { IPropertyType } from "./IPropertyTypes";
import { IDealType } from "./IDealTypes";
import { IRegion } from "./IRegions";
import { ICity } from "./ICities";
import { ICityArea } from "./ICityAreas";
import { ICoordinate, ILocalizedTitles, IUser } from "./index";

export interface IProduct {
    _id?: string;
    name: string;
    propertyType: IPropertyType;
    dealType: IDealType;
    description: string;
    price: number;
    address: string;
    status?: 'active' | 'disabled';
    images: string[];
    productCharacters?: IProductCharacters
    region: IRegion;
    city: ICity;
    cityArea: ICityArea;
    coordinate: ICoordinate;
    creator?: IUser
    createdAt?: string;
    updatedAt?: string;
}

export interface IProductCharacters {
    _id?: string;
    bathroom: ILocalizedTitles | string;
    balcony: ILocalizedTitles | string;
    bedsQuantity: ILocalizedTitles | string;
    ceilingHeight: ILocalizedTitles | string;
    constructionYear: ILocalizedTitles | string;
    floor: ILocalizedTitles | string;
    homeInfrastructure: ILocalizedTitles[] | string[];
    inBathroom: ILocalizedTitles[] | string[];
    inKitchen: ILocalizedTitles[] | string[];
    levelsNumber: ILocalizedTitles | string;
    lifeArrangement: ILocalizedTitles[] | string[];
    propertyCondition: ILocalizedTitles | string;
    rentalType: ILocalizedTitles | string;
    repair: ILocalizedTitles | string;
    roomsQuantity: ILocalizedTitles | string;
    storeysNumber: ILocalizedTitles | string;
    studio: boolean;
    totalArea_sq_m: number;
    wallMaterial: ILocalizedTitles | string;
}

export interface IProducts {
    rows: IProduct[];
    count: number;
}

export interface IProductUpdatePayload {
    id: string | string[];
    data: IProduct
}
