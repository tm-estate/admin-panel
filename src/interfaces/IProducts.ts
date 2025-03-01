import { IPropertyType } from "./IPropertyTypes";
import { IDealType } from "./IDealTypes";
import {IRegion} from "./IRegions";
import {ICity} from "./ICities";
import {ICityAreas} from "./ICityAreas";
import {ICoordinate} from "./index";

export interface IProduct {
    _id: string;
    "name": string;
    propertyType: IPropertyType;
    dealType: IDealType;
    description: string;
    price: number;
    address: string;
    status: 'active' | 'disabled';
    images: string[];
    productCharacters: {
        "_id": "67ac9b53d01990958c7653c8",
        "roomsQuantity": {
            "_id": "63d3d45a9b7d7805c91bd81a",
            "titleRu": "3",
            "titleEn": "3",
            "titleTm": "3"
        },
        "totalArea_sq_m": 200
    },
    region: IRegion;
    city: ICity;
    cityArea: ICityAreas;
    coordinate: ICoordinate;
    creator: {
        "_id": "67a7a189d39ff523dec1ab1e",
        "email": "m@m.com",
        "phone": "9936508067",
        "role": "user",
        "name": "Davut",
        "isPhoneNumberConfirmed": true,
        "products": [
            "67aa424e67a3d73c8b125734",
            "67ac9b53d01990958c7653ca"
        ],
        "followers": [],
        "isAgent": false,
        "createdAt": "2025-02-08T18:25:13.872Z"
    };
    createdAt?: string;
    updatedAt?: string;
}
