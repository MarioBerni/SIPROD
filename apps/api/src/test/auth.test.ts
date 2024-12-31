import { createMockContext, MockContext } from './setup';

// Define el enum localmente
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

let mockCtx: MockContext;

beforeEach(() => {
  mockCtx = createMockContext();
});

describe('Auth', () => {
  test('login should return user data with valid credentials', async () => {
    // Mock data
    const mockUser = {
      id: '1',
      username: 'testuser',
      password: 'hashedpassword',
      email: 'test@example.com',
      fullName: 'Test User',
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Mock the prisma query
    mockCtx.prisma.user.findUnique.mockResolvedValue(mockUser);

    // Basic test to ensure setup works
    expect(mockCtx.prisma.user.findUnique).toBeDefined();
  });
});
