import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';
import { jest } from '@jest/globals';

// Mock TopicsLinks component FIRST
jest.mock('../ui/TopicsLinks', () => {
  const MockTopicsLinks = () => {
    return <div data-testid="topics-links">Mocked Topics Links</div>;
  };
  return { TopicsLinks: MockTopicsLinks };
});

// Mock axios
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ 
    data: { 
      success: true, 
      data: [
        { 
          id: 1, 
          titulo: 'Test Topic', 
          explicacion_tecnica: 'Test Description',
          explicacion_ejemplo: 'Example explanation',
          librerias: ['react'],
          created_at: '2024-01-01'
        }
      ] 
    } 
  })),
}));

// Mock next/image
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock CarrouselHome component
jest.mock('../ui/CarrouselHome', () => {
  return {
    CarouselHome: function MockCarouselHome() {
      return <div data-testid="carousel-home">Mocked Carousel</div>;
    },
  };
});



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
    const link = screen.getByText('Explorar comparaciones al detalle');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/page?id=1');
    expect(link).toHaveClass('inline-block', 'bg-blue-600', 'hover:bg-blue-700');
  });

  it('renders main page elements', () => {
    render(<Home />);

    // Check that the link is present
    expect(screen.getByText('Explorar comparaciones al detalle')).toBeInTheDocument();
    
    // Note: TopicsLinks component is tested separately in its own test file
  });

  it('link has correct styling classes', () => {
    render(<Home />);
    const link = screen.getByText('Explorar comparaciones al detalle');
    
    expect(link).toHaveClass('inline-block');
    expect(link).toHaveClass('bg-blue-600');
    expect(link).toHaveClass('hover:bg-blue-700');
  });
});