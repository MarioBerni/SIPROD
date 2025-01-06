import { Rol } from '@prisma/client';

declare namespace Express {
  export interface Request {
    user?: {
      userId: string;
      rol: Rol;
    };
  }
}
