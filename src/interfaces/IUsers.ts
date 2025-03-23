import { Permission } from "@/constants/permissions";
import {Role} from "@/constants/roles";

export interface IUser {
    _id?: string
    name: string;
    phone: string;
    email: string;
    isPhoneNumberConfirmed: boolean;
    imgUri?: string;
    avatar?: string;
    products?: string[];
    permissions?: Permission[];
    role?: Role | '';
    isAgent?: boolean;
    imgAgent?: string;
    savedProducts: string[];
    disabled?: boolean;
    followers?: string[]
    createdAt?: string,
    updatedAt?: string,
}

export interface IUsers {
    rows: IUser[];
    count: number
}

export interface IUserUpdatePayload {
    id: string | string[];
    data: IUser
}
