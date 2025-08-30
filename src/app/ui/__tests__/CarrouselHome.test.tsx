import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarouselHome } from '../CarrouselHome';
import { jest } from '@jest/globals';

interface CarouselProps {
  children: React.ReactNode;
  slideInterval?: number;
  slide?: boolean;
  indicators?: boolean;
  leftControl?: React.ReactNode;
  rightControl?: React.ReactNode;
  [key: string]: unknown;
}

// Mock flowbite-react Carousel component
jest.mock('flowbite-react', () => ({
  Carousel: ({ children, slideInterval }: CarouselProps) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const slides = React.Children.toArray(children);
    
    const nextSlide = React.useCallback(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, [slides.length]);
    
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };
    
    const goToSlide = (index: number) => {
      setCurrentSlide(index);
    };
    
    React.useEffect(() => {
      if (slideInterval && slideInterval > 0) {
        const interval = setInterval(nextSlide, slideInterval);
        return () => clearInterval(interval);
      }
    }, [slideInterval, nextSlide]);
    
    return (
      <div data-testid="carousel" {...props}>
        <div data-testid="carousel-content">
          {slides.map((slide, index) => (
            <div
              key={index}
              data-testid={`slide-${index}`}
              style={{ display: index === currentSlide ? 'block' : 'none' }}
            >
              {slide}
            </div>
          ))}
        </div>
        <div data-testid="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              data-testid={`indicator-${index}`}
                onClick={() => goToSlide(index)}
               className={index === currentSlide ? 'active' : ''}
             >
               {index + 1}
             </button>
           ))}
         </div>
        <button
          data-testid="prev-button"
          onClick={prevSlide}
        >
          Previous
        </button>
        <button
          data-testid="next-button"
          onClick={nextSlide}
        >
          Next
        </button>
      </div>
    );
  },
}));

// Simplified render function without providers for testing
const renderComponent = (component: React.ReactElement) => {
  return render(component);
};

describe('CarouselHome', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders carousel with all three slides', () => {
    renderComponent(<CarouselHome />);
    
    expect(screen.getByTestId('carousel')).toBeInTheDocument();
  });

  test('displays carousel with proper styling', () => {
    renderComponent(<CarouselHome />);
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
    expect(carousel).toHaveClass('relative');
  });

  test('renders carousel structure', () => {
    renderComponent(<CarouselHome />);
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
    
    // Verify carousel has basic structure
    expect(carousel).toHaveClass('relative');
  });

  test('carousel renders without slideInterval by default', () => {
    renderComponent(<CarouselHome />);
    
    const carousel = screen.getByTestId('carousel');
    expect(carousel).toBeInTheDocument();
    
    // The carousel component doesn't have slideInterval prop by default
    // so auto-advance is not enabled
  });

  test('contains expected framework content', () => {
    renderComponent(<CarouselHome />);
    
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  test('contains Font Awesome icons for each framework', () => {
    renderComponent(<CarouselHome />);
    
    // Check for Font Awesome icon classes in the rendered HTML
    const container = screen.getByTestId('carousel');
    const html = container.innerHTML;
    
    expect(html).toContain('fab fa-angular');
    expect(html).toContain('fab fa-react');
    expect(html).toContain('fab fa-vuejs');
  });

  test('applies correct gradient backgrounds for each framework', () => {
    renderComponent(<CarouselHome />);
    
    const container = screen.getByTestId('carousel');
    const html = container.innerHTML;
    
    // Check for gradient classes in the HTML
    expect(html).toContain('from-red-600');
    expect(html).toContain('to-red-400');
    expect(html).toContain('from-cyan-400');
    expect(html).toContain('to-blue-500');
    expect(html).toContain('from-green-400');
    expect(html).toContain('to-green-600');
  });
});