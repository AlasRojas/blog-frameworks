import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import { useLanguage } from '../contexts/LanguageContext';

// Mock the components
vi.mock('../ui/CarrouselHome', () => ({
  CarouselHome: () => <div data-testid="carousel-home">Carousel Component</div>
}));

vi.mock('../ui/TopicsLinks', () => ({
  TopicsLinks: () => <div data-testid="topics-links">Topics Links Component</div>
}));

vi.mock('flowbite-react', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  )
}));

// Mock the LanguageContext
vi.mock('../contexts/LanguageContext', () => ({
  useLanguage: vi.fn()
}));

const mockUseLanguage = vi.mocked(useLanguage);

const mockTexts = {
  home: {
    carousel: {
      title: "Test Carousel Title",
      frameworks: {
        react: "React",
        vue: "Vue",
        angular: "Angular"
      }
    },
    explanation: {
      subtitle: "Test Explanation Subtitle",
      description: "Test explanation description"
    },
    example: {
      title: "Test Example Title",
      description: "Test example description"
    }
  }
};

describe('Home Page', () => {
  beforeEach(() => {
    mockUseLanguage.mockReturnValue({
      texts: mockTexts,
      currentLanguage: 'es',
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en']
    });
  });

  it('should render the main page structure', () => {
    render(<Home />);
    
    expect(screen.getByText('Test Carousel Title')).toBeInTheDocument();
    expect(screen.getByTestId('carousel-home')).toBeInTheDocument();
    expect(screen.getByTestId('topics-links')).toBeInTheDocument();
  });

  it('should render explanation section', () => {
    render(<Home />);
    
    expect(screen.getByText('Test Explanation Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test explanation description')).toBeInTheDocument();
  });

  it('should render example section', () => {
    render(<Home />);
    
    expect(screen.getByText('Test Example Title')).toBeInTheDocument();
    expect(screen.getByText('Test example description')).toBeInTheDocument();
  });

  it('should render framework code cards', () => {
    render(<Home />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
  });

  it('should display React code example', () => {
    render(<Home />);
    
    expect(screen.getByText(/import { useState } from 'react'/)).toBeInTheDocument();
    expect(screen.getByText(/function Counter\(\)/)).toBeInTheDocument();
  });

  it('should display Vue code example', () => {
    render(<Home />);
    
    expect(screen.getAllByText(/template/)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/count/)[0]).toBeInTheDocument();
  });

  it('should display Angular code example', () => {
    render(<Home />);
    
    expect(screen.getByText(/import { Component } from '@angular\/core'/)).toBeInTheDocument();
    expect(screen.getByText(/@Component/)).toBeInTheDocument();
  });

  it('should have proper CSS classes for layout', () => {
    render(<Home />);
    
    const mainContainer = screen.getByText('Test Carousel Title').closest('div');
    expect(mainContainer).toHaveClass('text-center', 'py-8');
  });

  it('should render all three code cards', () => {
    render(<Home />);
    
    const cards = screen.getAllByTestId('card');
    expect(cards).toHaveLength(3);
  });

  it('should handle missing texts gracefully', () => {
    mockUseLanguage.mockReturnValue({
      texts: null,
      currentLanguage: 'es',
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en']
    });

    render(<Home />);
    
    // When texts is null, the component should still render with fallback values
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Vue')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
  });

  it('should handle partial texts gracefully', () => {
    mockUseLanguage.mockReturnValue({
      texts: {
        home: {
          carousel: {
            frameworks: {}
          },
          explanation: {},
          example: {}
        }
      },
      currentLanguage: 'es',
      changeLanguage: vi.fn(),
      availableLanguages: ['es', 'en']
    });

    render(<Home />);
    
    const loadingTexts = screen.getAllByText('Cargando...');
    expect(loadingTexts.length).toBeGreaterThanOrEqual(3);
  });

  it('should maintain code state correctly', () => {
    render(<Home />);
    
    // Check that code examples are properly maintained in state
    expect(screen.getByText(/const \[count, setCount\] = useState\(0\)/)).toBeInTheDocument();
    expect(screen.getByText(/count: 0/)).toBeInTheDocument();
    expect(screen.getByText(/count = 0;/)).toBeInTheDocument();
  });

  it('should have responsive grid layout', () => {
    render(<Home />);
    
    const gridContainer = screen.getByText('Test Explanation Subtitle').closest('.grid');
    expect(gridContainer).toHaveClass('grid-cols-1', 'lg:grid-cols-12');
  });

  it('should render framework cards with proper styling', () => {
    render(<Home />);
    
    const reactTitle = screen.getByText('React');
    const vueTitle = screen.getByText('Vue');
    const angularTitle = screen.getByText('Angular');
    
    expect(reactTitle).toHaveClass('text-blue-600', 'dark:text-blue-400');
    expect(vueTitle).toHaveClass('text-green-600', 'dark:text-green-400');
    expect(angularTitle).toHaveClass('text-red-600', 'dark:text-red-400');
  });

  it('should have proper semantic structure', () => {
    render(<Home />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
  });
});