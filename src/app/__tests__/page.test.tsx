import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mock TopicsLinks component FIRST
jest.mock('../ui/TopicsLinks', () => {
  const MockTopicsLinks = () => {
    return <div data-testid="topics-links">Mocked Topics Links</div>;
  };
  return { TopicsLinks: MockTopicsLinks };
});

// Mock axios
const mockedAxios = axios as jest.Mocked<typeof axios>;
jest.mock('axios', () => ({
  get: jest.fn(),
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
    mockedAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: []
      }
    });
    render(<Home />);
    expect(document.body).toBeInTheDocument();
  });

  it('handles successful API response with topics', async () => {
    const mockTopics = [
      {
        id: 1,
        titulo: 'Test Topic 1',
        explicacion_tecnica: 'Test Description 1',
        explicacion_ejemplo: 'Example explanation 1',
        librerias: ['react'],
        created_at: '2024-01-01'
      },
      {
        id: 2,
        titulo: 'Test Topic 2',
        explicacion_tecnica: 'Test Description 2',
        explicacion_ejemplo: 'Example explanation 2',
        librerias: ['vue'],
        created_at: '2024-01-02'
      }
    ];

    mockedAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopics
      }
    });

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Topic 1')).toBeInTheDocument();
      expect(screen.getByText('Test Topic 2')).toBeInTheDocument();
    });
  });

  it('handles API response with success false', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        success: false,
        data: []
      }
    });

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los topics')).toBeInTheDocument();
    });
  });

  it('handles API request error', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockedAxios.get.mockRejectedValue(new Error('Network error'));

    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Error de conexión al cargar los topics')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching topics:', expect.any(Error));
    consoleErrorSpy.mockRestore();
  });

  it('shows loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<Home />);
    
    expect(screen.getByText('Cargando topics...')).toBeInTheDocument();
  });
});