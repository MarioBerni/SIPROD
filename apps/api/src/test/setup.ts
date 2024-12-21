import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Configuración global para Jest
beforeAll(() => {
  process.env.JWT_SECRET = 'test-secret';
  process.env.NODE_ENV = 'test';
});

// Limpiar todas las mocks después de cada prueba
afterEach(() => {
  jest.clearAllMocks();
});

// Mock de Prisma
export type Context = {
  prisma: PrismaClient;
};

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>;
};

export const createMockContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  };
};

export let mockCtx: MockContext;
export let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});
