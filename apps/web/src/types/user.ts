import { Rol } from '@prisma/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Rol;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UserRegistrationData extends UserLoginData {
  name: string;
  role?: Rol;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionUser {
  id: string;
  role: Rol;
}
