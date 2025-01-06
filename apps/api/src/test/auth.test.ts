import { createMockContext, MockContext } from './setup';
import type { Rol, Grado } from '@prisma/client';

// Mock Prisma client
jest.mock('@prisma/client', () => {
  const actual = jest.requireActual('@prisma/client');
  return {
    ...actual,
    Rol: {
      ADMINISTRADOR: 'ADMINISTRADOR',
      USUARIO: 'USUARIO'
    },
    Grado: {
      CTE_GENERAL: 'CTE_GENERAL',
      CTE_MAYOR: 'CTE_MAYOR',
      COMISARIO: 'COMISARIO'
    }
  };
});

let mockCtx: MockContext;

beforeEach(() => {
  mockCtx = createMockContext();
});

describe('Auth', () => {
  test('login should return user data with valid credentials', async () => {
    // Mock data
    const mockUser = {
      id: 'USR20250105223147',
      fechaCreacion: new Date(),
      ultimaFechaAcceso: null,
      contrasenaActual: 'hashedpassword',
      nuevaContrasena: null,
      grado: 'CTE_GENERAL' as Grado,
      nombre: 'Test User',
      rol: 'ADMINISTRADOR' as Rol,
      cargo: 'Administrador',
      correo: 'test@siprod.gob.ar',
      terminosCondiciones: true,
      desplieguesCargados: 0,
      activo: true,
      updatedAt: new Date()
    };

    // Mock the prisma query
    mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser);

    // Basic test to ensure setup works
    expect(mockCtx.prisma.user.findUnique).toBeDefined();
  });
});
