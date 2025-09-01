import { jest } from '@jest/globals';

// Mock React hooks
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(() => ['mock state', jest.fn()])
}));

// Mock all external dependencies
jest.mock('../ui/TopicsLinks', () => ({
  TopicsLinks: jest.fn(() => null)
}));

jest.mock('../ui/CarrouselHome', () => ({
  CarouselHome: jest.fn(() => null)
}));

jest.mock('flowbite-react', () => ({
  Card: jest.fn(({ children }) => children)
}));

jest.mock('../contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    texts: {
      home: {
        carousel: { title: 'Test Title', frameworks: { react: 'React', vue: 'Vue', angular: 'Angular' } },
        explanation: { subtitle: 'Test Subtitle', description: 'Test Description' },
        example: { title: 'Test Example', description: 'Test Example Description' }
      }
    }
  }))
}));

describe('Home Component', () => {
  let Home: any;

  beforeAll(() => {
    Home = require('../page').default;
  });

  it('can be imported without errors', () => {
    expect(() => {
      require('../page');
    }).not.toThrow();
  });

  it('exports a default function', () => {
    expect(typeof Home).toBe('function');
  });

  it('function can be called without throwing', () => {
    expect(() => {
      Home();
    }).not.toThrow();
  });

  it('uses language context hook', () => {
    const { useLanguage } = require('../contexts/LanguageContext');
    Home();
    expect(useLanguage).toHaveBeenCalled();
  });

  it('uses useState hook for code examples', () => {
    const { useState } = require('react');
    Home();
    expect(useState).toHaveBeenCalled();
  });

  it('component structure is valid', () => {
    const result = Home();
    expect(result).toBeDefined();
  });

  it('handles text content from language context', () => {
    const { useLanguage } = require('../contexts/LanguageContext');
    jest.clearAllMocks();
    Home();
    expect(useLanguage).toHaveBeenCalled();
  });
});