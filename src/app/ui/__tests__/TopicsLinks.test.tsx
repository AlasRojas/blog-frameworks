import { jest } from '@jest/globals';

// Mock all external dependencies
jest.mock('axios');
jest.mock('next/link', () => {
  return jest.fn(({ children }) => children);
});
jest.mock('flowbite-react', () => ({
  Card: jest.fn(({ children }) => children)
}));
jest.mock('../../contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    texts: {
      topics: {
        title: 'Test Topics Title',
        loading: 'Loading...',
        error: 'Error loading topics'
      }
    }
  }))
}));

describe('TopicsLinks Component', () => {
  it('can be imported without errors', () => {
    expect(() => {
      require('../TopicsLinks');
    }).not.toThrow();
  });

  it('exports TopicsLinks function', () => {
    const { TopicsLinks } = require('../TopicsLinks');
    expect(typeof TopicsLinks).toBe('function');
  });
});