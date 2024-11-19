import { Role } from '../modules/users/enum';

export type IUser = {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  id: string;
  role: Role;
};
