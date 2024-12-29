import { z } from 'zod';

export const registrationSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  fullName: z.string().min(2).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
export type LoginData = z.infer<typeof loginSchema>;

export const validateRegistration = (data: unknown): { 
  error: z.ZodError | null; 
  value: RegistrationData | null;
} => {
  try {
    const result = registrationSchema.parse(data);
    return { error: null, value: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error, value: null };
    }
    throw error;
  }
};

export const validateLogin = (data: unknown): {
  error: z.ZodError | null;
  value: LoginData | null;
} => {
  try {
    const result = loginSchema.parse(data);
    return { error: null, value: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error, value: null };
    }
    throw error;
  }
};
