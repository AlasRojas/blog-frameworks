import { jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock flowbite-react Carousel
const mockCarousel = jest.fn(({ children }) => (
  <div data-testid="carousel-container">
    {children}
  </div>
));

jest.mock('flowbite-react', () => ({
  Carousel: mockCarousel
}));

describe('CarouselHome Component', () => {
  let CarouselHome: any;

  beforeAll(() => {
    CarouselHome = require('../CarrouselHome').CarouselHome;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can be imported without errors', () => {
    expect(() => {
      require('../CarrouselHome');
    }).not.toThrow();
  });

  it('exports CarouselHome function', () => {
    expect(typeof CarouselHome).toBe('function');
  });

  it('renders without crashing', () => {
    expect(() => {
      render(<CarouselHome />);
    }).not.toThrow();
  });

  it('renders carousel container with correct structure', () => {
    render(<CarouselHome />);
    
    // Verify carousel is rendered
    expect(screen.getByTestId('carousel-container')).toBeInTheDocument();
    expect(mockCarousel).toHaveBeenCalledTimes(1);
  });

  it('renders all three framework slides', () => {
    render(<CarouselHome />);
    
    // Check for Angular slide
    expect(screen.getByText('Angular')).toBeInTheDocument();
    
    // Check for React slide
    expect(screen.getByText('React')).toBeInTheDocument();
    
    // Check for Vue slide
    expect(screen.getByText('Vue')).toBeInTheDocument();
  });

  it('applies correct CSS classes to container', () => {
    const { container } = render(<CarouselHome />);
    const mainDiv = container.firstChild as HTMLElement;
    
    expect(mainDiv).toHaveClass('relative');
    expect(mainDiv).toHaveClass('h-56');
    expect(mainDiv).toHaveClass('sm:h-64');
    expect(mainDiv).toHaveClass('xl:h-80');
    expect(mainDiv).toHaveClass('2xl:h-96');
    expect(mainDiv).toHaveClass('rounded-lg');
  });

  it('renders framework icons with correct classes', () => {
    render(<CarouselHome />);
    
    // Check for Angular icon
    const angularIcon = screen.getByText('Angular').parentElement?.querySelector('i');
    expect(angularIcon).toHaveClass('fab', 'fa-angular', 'text-6xl', 'text-white');
    
    // Check for React icon
    const reactIcon = screen.getByText('React').parentElement?.querySelector('i');
    expect(reactIcon).toHaveClass('fab', 'fa-react', 'text-6xl', 'text-white');
    
    // Check for Vue icon
    const vueIcon = screen.getByText('Vue').parentElement?.querySelector('i');
    expect(vueIcon).toHaveClass('fab', 'fa-vuejs', 'text-6xl', 'text-white');
  });

  it('applies correct gradient backgrounds to slides', () => {
    render(<CarouselHome />);
    
    // Angular slide (red gradient) - need to go up to the slide container
    const angularText = screen.getByText('Angular');
    const angularSlide = angularText.parentElement?.parentElement;
    expect(angularSlide).toHaveClass('bg-gradient-to-r', 'from-red-600', 'to-red-400');
    
    // React slide (blue gradient)
    const reactText = screen.getByText('React');
    const reactSlide = reactText.parentElement?.parentElement;
    expect(reactSlide).toHaveClass('bg-gradient-to-r', 'from-cyan-400', 'to-blue-500');
    
    // Vue slide (green gradient)
    const vueText = screen.getByText('Vue');
    const vueSlide = vueText.parentElement?.parentElement;
    expect(vueSlide).toHaveClass('bg-gradient-to-r', 'from-green-400', 'to-green-600');
  });

  it('calls Carousel component with theme configuration', () => {
    render(<CarouselHome />);
    
    expect(mockCarousel).toHaveBeenCalledTimes(1);
    const callArgs = mockCarousel.mock.calls[0][0];
    expect(callArgs).toHaveProperty('theme');
    expect(callArgs.theme).toHaveProperty('scrollContainer');
    expect(callArgs.theme.scrollContainer).toHaveProperty('base', 'overflow-hidden');
  });

  it('renders slides with proper layout classes', () => {
    render(<CarouselHome />);
    
    const slides = screen.getAllByText(/Angular|React|Vue/);
    expect(slides).toHaveLength(3);
    
    // Verify that each slide has the expected content structure
    slides.forEach(slide => {
      const contentContainer = slide.parentElement;
      expect(contentContainer).toHaveClass('flex', 'flex-col', 'items-center', 'space-y-4');
    });
  });
});