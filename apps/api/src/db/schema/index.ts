export * from './users';

// Re-export types
import { InferModel } from 'drizzle-orm';
import { users } from './users';

export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
