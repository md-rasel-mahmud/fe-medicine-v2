//user data type for auth state
//"_id": "69a3f83fea404aa2af8bb0b7",
//"phone": "0172222223",
//"email": "merchant@example2.com",
//"role": "MERCHANT",
//"createdAt": "2026-03-01T08:26:39.396Z",
//"updatedAt": "2026-03-01T08:26:39.396Z"

import type { RolesEnum } from "@/enum/role.enum";

export interface UserType {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  role: RolesEnum;
  approved?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponseType {
  message: string;
  result: UserType;
  token: string;
}

export interface LoginPayloadType {
  emailOrPhone: string;
  password: string;
}

export interface RegisterPayloadType {
  name: string;
  phone: string;
  email?: string;
  address: string;
  password: string;
}
