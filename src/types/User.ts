export interface IUser {
  _id: string
  name: string;
  phone: string;
  email: string;
  isPhoneNumberConfirmed: boolean;
  imgUri: string;
  savedProducts: string[];
}
