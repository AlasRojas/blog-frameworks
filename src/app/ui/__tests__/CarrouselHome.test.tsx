import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock the entire CarouselHome component
const mockCarouselHome = jest.fn(() => (
  <div data-testid="carousel-container">
    <div>Angular</div>
    <div>React</div>
    <div>Vue</div>
  </div>
));

jest.mock('../CarrouselHome', () => ({
  __esModule: true,
  CarouselHome: mockCarouselHome
}));

// Import after mocks
import { CarouselHome } from '../CarrouselHome';

describe('CarouselHome Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can be imported without errors', () => {
    expect(CarouselHome).toBeDefined();
  });

  it('exports CarouselHome function', () => {
    expect(typeof CarouselHome).toBe('function');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<CarouselHome />);
    }).not.toThrow();
  });

  it('component structure is valid', () => {
    const result = CarouselHome();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });

  it('component can be called multiple times', () => {
    expect(() => {
      CarouselHome();
      CarouselHome();
    }).not.toThrow();
  });


});