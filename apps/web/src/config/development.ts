export const DEV_CONFIG = {
  // Usuario simulado para desarrollo
  mockUser: {
    id: '1',
    nombre: 'Usuario Desarrollo',
    correo: 'dev@siprod.local',
    rol: 'ADMIN',
    estado: 'ACTIVO',
    grado: 'Oficial Mayor',
    cargo: 'Desarrollador'
  },
  // Flag para habilitar/deshabilitar autenticación en desarrollo
  bypassAuth: process.env.NODE_ENV === 'development',
  // Token simulado para desarrollo
  mockToken: 'dev-token-123'
};
