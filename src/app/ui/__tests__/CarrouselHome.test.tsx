import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CarouselHome } from '../CarrouselHome';
import { jest } from '@jest/globals';

// Mock flowbite-react Carousel component
jest.mock('flowbite-react', () => ({
  Carousel: ({ children, slideInterval, slide, indicators, leftControl, rightControl, ...props }: any) => {
    const [currentSlide, setCurrentSlide] = React.useState(0);
    const slides = React.Children.toArray(children);
    
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };
    
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
    }, [slideInterval]);
    
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
        {indicators && (
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
        )}
        {leftControl && (
          <button
            data-testid="prev-button"
            onClick={prevSlide}
          >
            {leftControl}
          </button>
        )}
        {rightControl && (
          <button
            data-testid="next-button"
            onClick={nextSlide}
          >
            {rightControl}
          </button>
        )}
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
    expect(screen.getByTestId('slide-0')).toBeInTheDocument();
    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
    expect(screen.getByTestId('slide-2')).toBeInTheDocument();
  });

  test('displays first slide initially', () => {
    renderComponent(<CarouselHome />);
    
    const firstSlide = screen.getByTestId('slide-0');
    const secondSlide = screen.getByTestId('slide-1');
    const thirdSlide = screen.getByTestId('slide-2');
    
    expect(firstSlide).toHaveStyle('display: block');
    expect(secondSlide).toHaveStyle('display: none');
    expect(thirdSlide).toHaveStyle('display: none');
  });

  test('has navigation controls', () => {
    renderComponent(<CarouselHome />);
    
    expect(screen.getByTestId('prev-button')).toBeInTheDocument();
    expect(screen.getByTestId('next-button')).toBeInTheDocument();
  });

  test('has indicators', () => {
    renderComponent(<CarouselHome />);
    
    expect(screen.getByTestId('carousel-indicators')).toBeInTheDocument();
    expect(screen.getByTestId('indicator-0')).toBeInTheDocument();
    expect(screen.getByTestId('indicator-1')).toBeInTheDocument();
    expect(screen.getByTestId('indicator-2')).toBeInTheDocument();
  });

  test('navigates to next slide when next button is clicked', () => {
    renderComponent(<CarouselHome />);
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    const firstSlide = screen.getByTestId('slide-0');
    const secondSlide = screen.getByTestId('slide-1');
    
    expect(firstSlide).toHaveStyle('display: none');
    expect(secondSlide).toHaveStyle('display: block');
  });

  test('navigates to previous slide when prev button is clicked', () => {
    renderComponent(<CarouselHome />);
    
    const prevButton = screen.getByTestId('prev-button');
    fireEvent.click(prevButton);
    
    const firstSlide = screen.getByTestId('slide-0');
    const thirdSlide = screen.getByTestId('slide-2');
    
    expect(firstSlide).toHaveStyle('display: none');
    expect(thirdSlide).toHaveStyle('display: block');
  });

  test('navigates to specific slide when indicator is clicked', () => {
    renderComponent(<CarouselHome />);
    
    const thirdIndicator = screen.getByTestId('indicator-2');
    fireEvent.click(thirdIndicator);
    
    const firstSlide = screen.getByTestId('slide-0');
    const thirdSlide = screen.getByTestId('slide-2');
    
    expect(firstSlide).toHaveStyle('display: none');
    expect(thirdSlide).toHaveStyle('display: block');
  });

  test('auto-advances slides with slideInterval', async () => {
    jest.useFakeTimers();
    
    renderComponent(<CarouselHome />);
    
    const firstSlide = screen.getByTestId('slide-0');
    const secondSlide = screen.getByTestId('slide-1');
    
    expect(firstSlide).toHaveStyle('display: block');
    expect(secondSlide).toHaveStyle('display: none');
    
    // Fast-forward time by slideInterval (5000ms)
    jest.advanceTimersByTime(5000);
    
    await waitFor(() => {
      expect(firstSlide).toHaveStyle('display: none');
      expect(secondSlide).toHaveStyle('display: block');
    });
    
    jest.useRealTimers();
  });

  test('contains expected slide content', () => {
    renderComponent(<CarouselHome />);
    
    expect(screen.getByText('Slide 1')).toBeInTheDocument();
    expect(screen.getByText('Slide 2')).toBeInTheDocument();
    expect(screen.getByText('Slide 3')).toBeInTheDocument();
  });
});