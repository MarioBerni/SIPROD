// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockNextImage(props: any) {
    return Object.assign({}, props, { type: 'img' });
  }
}));

// Mock Next/Router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
      },
      beforePopState: jest.fn(() => null),
      prefetch: jest.fn(() => null),
    };
  },
}));
