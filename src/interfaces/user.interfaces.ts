// The auth user roles (interfaces)

import { SystemPermissions } from "./permissions/permissions";

export type AuthUserRole = "Admin" | "User";

// The user interface & types (profile from the token)

export default interface UserInterfaceType {
  id: string;
  role: AuthUserRole;
  pic: string;
  phoneNumber: string[];
  location: {
    country: string;
    state: string;
    city: string;
    zipcode: string;
  };
  gender: "male" | "female";
  username: string;
  fullName: string;
  email: string;
}

// The user access info types

export type UserAccessInfoType = {
  role: {
    color: string;
    id: string;
    name: string;
  };
  active: boolean;
  permissions: SystemPermissions[];
};

// User Interfaces for CRUD operations

export interface UserInterface {
  createdAt: string | Date; // IOS Date
  updateAt: string | Date; // IOS Date
  id: string;

  // main info
  profileInfo: {
    pic: string;
    username: string;
    email: string;
    fullName: string;
    phoneNumber?: string[];
    location?: {
      country?: string;
      state?: string;
      city?: string;
      zipcode?: string;
    };
    gender: "male" | "female";
  };

  // access/auth info
  access: {
    role: {
      id: string;
      name: string;
      color: string;
    };
    active: boolean;
    isAdmin: boolean;
  };
}

// create user interface
export interface CreateUserInterface {
  username: string;
  fullName: string;
  email: string;
  pic: string;
  role: string;
  phoneNumbers?: string[];
  location: {
    country?: string;
    state?: string;
    city?: string;
    zipcode?: string;
  };
  gender: "male" | "female";
  password?: string;
}

// update user type
export type UpdateUserInterface = Omit<CreateUserInterface, "email">;
