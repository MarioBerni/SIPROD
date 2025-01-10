// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock para mapbox-gl ya que no es compatible con Jest
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    remove: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    getLayer: jest.fn(),
    setLayoutProperty: jest.fn(),
  })),
  accessToken: '',
}));

// Mock para next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  useSearchParams: jest.fn(() => ({
    get: jest.fn(),
  })),
}));

// Mock para window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
