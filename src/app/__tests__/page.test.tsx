import { render, screen } from '@testing-library/react';
import Home from '../page';
import { jest } from '@jest/globals';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} alt={props.alt || ''} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}));

// Mock CarouselHome component
jest.mock('../ui/CarrouselHome', () => ({
  default: () => <div data-testid="carousel-home">Mocked Carousel</div>,
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Home />);
    // Basic rendering test
    expect(document.body).toBeInTheDocument();
  });

  it('renders the link to Page with correct attributes', () => {
    render(<Home />);
    const link = screen.getByText('Ir a Page');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/page?id=1');
    expect(link).toHaveClass('text-blue-500', 'hover:text-blue-700', 'underline');
  });

  it('renders main page elements', () => {
    render(<Home />);

    // Check that the link is present
    expect(screen.getByText('Ir a Page')).toBeInTheDocument();
  });

  it('link has correct styling classes', () => {
    render(<Home />);
    const link = screen.getByText('Ir a Page');
    
    expect(link).toHaveClass('text-blue-500');
    expect(link).toHaveClass('hover:text-blue-700');
    expect(link).toHaveClass('underline');
  });
});