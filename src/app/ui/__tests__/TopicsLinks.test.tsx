import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TopicsLinks } from '../TopicsLinks';
import { jest } from '@jest/globals';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) {
    return <a href={href} {...props}>{children}</a>;
  };
});

// Mock flowbite-react components
jest.mock('flowbite-react', () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={className} data-testid="card">{children}</div>
  ),
}));

describe('TopicsLinks Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock console.error to avoid test pollution
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<TopicsLinks />);
    
    expect(screen.getByText('Cargando topics...')).toBeInTheDocument();
  });

  it('renders topics successfully', async () => {
    const mockTopics = [
      { 
        id: 1, 
        titulo: 'React Basics', 
        explicacion_tecnica: 'Learn React fundamentals',
        explicacion_ejemplo: 'Example explanation',
        librerias: ['react'],
        created_at: '2024-01-01'
      },
      { 
        id: 2, 
        titulo: 'Vue.js Guide', 
        explicacion_tecnica: 'Vue.js comprehensive guide',
        explicacion_ejemplo: 'Example explanation',
        librerias: ['vue'],
        created_at: '2024-01-01'
      },
    ];

    mockedAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: mockTopics,
      },
    });

    render(<TopicsLinks />);

    await waitFor(() => {
      expect(screen.getByText('React Basics')).toBeInTheDocument();
      expect(screen.getByText('Vue.js Guide')).toBeInTheDocument();
    });

    // Check that links are created with correct href
    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/page/1');
    expect(links[1]).toHaveAttribute('href', '/page/2');
  });

  it('renders error state when API fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'));

    render(<TopicsLinks />);

    await waitFor(() => {
      expect(screen.getByText('Error de conexión al cargar los topics')).toBeInTheDocument();
    });
  });

  it('renders error state when API returns success: false', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        success: false,
        data: [],
      },
    });

    render(<TopicsLinks />);

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los topics')).toBeInTheDocument();
    });
  });

  it('renders empty state when no topics are returned', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        success: true,
        data: [],
      },
    });

    render(<TopicsLinks />);

    await waitFor(() => {
      expect(screen.getByText('No hay topics disponibles en este momento.')).toBeInTheDocument();
    });
  });
});