// Mock de variables de entorno para tests
process.env.JWT_SECRET = 'test_jwt_secret_for_testing_purposes_only';
process.env.NODE_ENV = 'test';
process.env.PORT = '4000';

// Silenciar logs durante los tests
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'info').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
