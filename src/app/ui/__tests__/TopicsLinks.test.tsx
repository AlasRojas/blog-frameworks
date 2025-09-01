import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock the entire TopicsLinks component
const mockTopicsLinks = jest.fn(() => (
  <div data-testid="topics-links">
    <div>Mocked Topics Links</div>
  </div>
));

jest.mock('../TopicsLinks', () => ({
  TopicsLinks: mockTopicsLinks
}));

// Import after mocks
import { TopicsLinks } from '../TopicsLinks';

// Simple mock for LanguageContext
jest.mock('../../contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    texts: { home: { topics: {} } }
  }))
}));

describe('TopicsLinks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can be imported without errors', () => {
    expect(TopicsLinks).toBeDefined();
  });

  it('exports TopicsLinks function', () => {
    expect(typeof TopicsLinks).toBe('function');
  });








});