import { jest } from '@jest/globals';

// Mock all external dependencies
jest.mock('flowbite-react', () => ({
  Carousel: jest.fn(({ children }) => children)
}));

jest.mock('../../contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    texts: {
      home: {
        carousel: {
          title: 'Test Carousel Title',
          frameworks: {
            react: 'React',
            vue: 'Vue',
            angular: 'Angular'
          }
        }
      }
    }
  }))
}));

describe('CarouselHome Component', () => {
  it('can be imported without errors', () => {
    expect(() => {
      require('../CarrouselHome');
    }).not.toThrow();
  });

  it('exports CarouselHome function', () => {
    const { CarouselHome } = require('../CarrouselHome');
    expect(typeof CarouselHome).toBe('function');
  });
});