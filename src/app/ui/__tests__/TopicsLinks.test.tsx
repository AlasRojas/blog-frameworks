import { jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react';

// Mock axios
const mockAxios = {
  get: jest.fn()
};

jest.mock('axios', () => mockAxios);

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, className }: any) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  };
});

// Mock flowbite-react Card
jest.mock('flowbite-react', () => ({
  Card: jest.fn(({ children, className }) => (
    <div className={className} data-testid="card">
      {children}
    </div>
  ))
}));

// Mock LanguageContext
const mockTexts = {
  home: {
    topics: {
      loading: 'Cargando topics...',
      error: 'Error:',
      empty: 'No hay topics disponibles en este momento.'
    }
  }
};

jest.mock('../../contexts/LanguageContext', () => ({
  useLanguage: jest.fn(() => ({
    texts: mockTexts
  }))
}));

describe('TopicsLinks Component', () => {
  let TopicsLinks: any;

  beforeAll(() => {
    TopicsLinks = require('../TopicsLinks').TopicsLinks;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can be imported without errors', () => {
    expect(() => {
      require('../TopicsLinks');
    }).not.toThrow();
  });

  it('exports TopicsLinks function', () => {
    expect(typeof TopicsLinks).toBe('function');
  });

  it('renders loading state initially', async () => {
    // Mock axios to never resolve
    mockAxios.get.mockImplementation(() => new Promise(() => {}));
    
    render(<TopicsLinks />);
    
    expect(screen.getByText('Cargando topics...')).toBeInTheDocument();
    expect(screen.getByText('Cargando topics...')).toHaveClass('text-gray-600');
  });

  it('renders error state when API call fails', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Network error'));
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText('Error de conexión al cargar los topics')).toBeInTheDocument();
    });
  });

  it('renders error state when API returns success: false', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: false,
        data: [],
        count: 0
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText(/Error:/)).toBeInTheDocument();
      expect(screen.getByText('Error al cargar los topics')).toBeInTheDocument();
    });
  });

  it('renders empty state when no topics are returned', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [],
        count: 0
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText('No hay topics disponibles en este momento.')).toBeInTheDocument();
    });
  });

  it('renders topics successfully', async () => {
    const mockTopics = [
      {
        id: 1,
        titulo: 'React Hooks',
        explicacion_tecnica: 'Los hooks son funciones que permiten usar estado y otras características de React.',
        explicacion_ejemplo: 'Ejemplo de useState',
        librerias: ['react', 'react-dom'],
        created_at: '2023-01-01'
      },
      {
        id: 2,
        titulo: 'Vue Composition API',
        explicacion_tecnica: 'La Composition API es una nueva forma de escribir componentes en Vue 3.',
        explicacion_ejemplo: 'Ejemplo de ref y reactive',
        librerias: ['vue'],
        created_at: '2023-01-02'
      }
    ];

    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics,
        count: 2
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText('Temas Fundamentales')).toBeInTheDocument();
      expect(screen.getByText('React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Vue Composition API')).toBeInTheDocument();
    });
  });

  it('renders topic details correctly', async () => {
    const mockTopic = {
      id: 1,
      titulo: 'React Hooks',
      explicacion_tecnica: 'Los hooks son funciones que permiten usar estado y otras características de React.',
      explicacion_ejemplo: 'Ejemplo de useState',
      librerias: ['react', 'react-dom'],
      created_at: '2023-01-01'
    };

    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [mockTopic],
        count: 1
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText('React Hooks')).toBeInTheDocument();
      expect(screen.getByText('Los hooks son funciones que permiten usar estado y otras características de React.')).toBeInTheDocument();
      expect(screen.getByText('Librerías relacionadas:')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
      expect(screen.getByText('react-dom')).toBeInTheDocument();
    });
  });

  it('renders topic without libraries', async () => {
    const mockTopic = {
      id: 1,
      titulo: 'JavaScript Basics',
      explicacion_tecnica: 'Conceptos básicos de JavaScript.',
      explicacion_ejemplo: 'Variables y funciones',
      librerias: [],
      created_at: '2023-01-01'
    };

    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [mockTopic],
        count: 1
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      expect(screen.getByText('JavaScript Basics')).toBeInTheDocument();
      expect(screen.getByText('Conceptos básicos de JavaScript.')).toBeInTheDocument();
      expect(screen.queryByText('Librerías relacionadas:')).not.toBeInTheDocument();
    });
  });

  it('makes API call to correct endpoint', async () => {
    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [],
        count: 0
      }
    });
    
    render(<TopicsLinks />);
    
    expect(mockAxios.get).toHaveBeenCalledWith('/api/topics');
  });

  it('renders grid layout for topics', async () => {
    const mockTopics = [
      {
        id: 1,
        titulo: 'Topic 1',
        explicacion_tecnica: 'Description 1',
        explicacion_ejemplo: 'Example 1',
        librerias: [],
        created_at: '2023-01-01'
      },
      {
        id: 2,
        titulo: 'Topic 2',
        explicacion_tecnica: 'Description 2',
        explicacion_ejemplo: 'Example 2',
        librerias: [],
        created_at: '2023-01-02'
      }
    ];

    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: mockTopics,
        count: 2
      }
    });
    
    const { container } = render(<TopicsLinks />);
    
    await waitFor(() => {
      const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2.gap-6');
      expect(gridContainer).toBeInTheDocument();
    });
  });

  it('renders correct links for topics', async () => {
    const mockTopic = {
      id: 123,
      titulo: 'Test Topic',
      explicacion_tecnica: 'Test description',
      explicacion_ejemplo: 'Test example',
      librerias: [],
      created_at: '2023-01-01'
    };

    mockAxios.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [mockTopic],
        count: 1
      }
    });
    
    render(<TopicsLinks />);
    
    await waitFor(() => {
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/page/123');
    });
  });
});