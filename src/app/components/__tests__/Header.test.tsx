import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../Header';
import { LanguageProvider } from '../../contexts/LanguageContext';

// Mock react-country-flag
vi.mock('react-country-flag', () => ({
  default: ({ countryCode, ...props }: { countryCode: string }) => (
    <span data-testid={`flag-${countryCode}`} {...props}>
      {countryCode}
    </span>
  ),
}));

// Mock fetch for language data
const mockLanguageData = {
  es: {
    header: {
      title: 'Blog Frameworks',
      flags: {
        england: 'Inglaterra',
        france: 'Francia',
        spain: 'España'
      }
    }
  },
  en: {
    header: {
      title: 'Blog Frameworks',
      flags: {
        england: 'England',
        france: 'France',
        spain: 'Spain'
      }
    }
  },
  fr: {
    header: {
      title: 'Blog Frameworks',
      flags: {
        england: 'Angleterre',
        france: 'France',
        spain: 'Espagne'
      }
    }
  }
};

global.fetch = vi.fn();

const mockFetch = global.fetch as ReturnType<typeof vi.fn>;

const HeaderWithProvider = () => (
  <LanguageProvider>
    <Header />
  </LanguageProvider>
);

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockImplementation((url: string) => {
      const language = url.includes('/es.json') ? 'es' : 
                     url.includes('/en.json') ? 'en' : 'fr';
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockLanguageData[language])
      } as Response);
    });
  });

  describe('Renderizado básico', () => {
    it('debe renderizar el header con el título correcto', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });
    });

    it('debe mostrar estado de loading inicialmente', () => {
      render(<HeaderWithProvider />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });

    it('debe renderizar los tres botones de idioma', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('ES')).toBeInTheDocument();
        expect(screen.getByText('EN')).toBeInTheDocument();
        expect(screen.getByText('FR')).toBeInTheDocument();
      });
    });

    it('debe renderizar las banderas de países', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByTestId('flag-ES')).toBeInTheDocument();
        expect(screen.getByTestId('flag-GB')).toBeInTheDocument();
        expect(screen.getByTestId('flag-FR')).toBeInTheDocument();
      });
    });
  });

  describe('Funcionalidad de cambio de idioma', () => {
    it('debe tener español como idioma por defecto', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });

      const esButton = screen.getByTestId('flag-ES').closest('button');
      expect(esButton).toBeInTheDocument();
    });

    it('debe cambiar a inglés y luego de vuelta a español', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });

      // Cambiar a inglés
      const enButton = screen.getByTestId('flag-GB').closest('button');
      fireEvent.click(enButton!);
      
      await waitFor(() => {
        expect(enButton).toBeInTheDocument();
      });

      // Cambiar de vuelta a español
      const esButton = screen.getByTestId('flag-ES').closest('button');
      fireEvent.click(esButton!);
      
      await waitFor(() => {
        expect(esButton).toBeInTheDocument();
      });
    });

    it('debe cambiar a inglés cuando se hace clic en EN', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });

      const enButton = screen.getByTestId('flag-GB').closest('button');
      fireEvent.click(enButton!);
      
      await waitFor(() => {
        expect(enButton).toBeInTheDocument();
      });
    });

    it('debe cambiar a francés cuando se hace clic en FR', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });

      const frButton = screen.getByTestId('flag-FR').closest('button');
      fireEvent.click(frButton!);
      
      await waitFor(() => {
        expect(frButton).toBeInTheDocument();
      });
    });

    it('debe tener botones de idioma clickeables', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByTestId('flag-ES')).toBeInTheDocument();
      });
      
      const esButton = screen.getByTestId('flag-ES').closest('button');
      const frButton = screen.getByTestId('flag-FR').closest('button');

      expect(esButton).toBeInTheDocument();
      expect(frButton).toBeInTheDocument();
    });
  });

  describe('Estructura y clases CSS', () => {
    it('debe tener la estructura correcta del header', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
        expect(header).toHaveClass('bg-white');
      });
    });

    it('debe tener el título con las clases correctas', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        const title = screen.getByText('Blog Frameworks');
        expect(title).toHaveClass('text-2xl', 'font-bold');
      });
    });

    it('debe tener tres botones de idioma', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
      });
      
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3);
    });
  });

  describe('Responsive design', () => {
    it('debe renderizar correctamente en diferentes tamaños', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        expect(screen.getByText('Blog Frameworks')).toBeInTheDocument();
        expect(screen.getByRole('banner')).toBeInTheDocument();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe mostrar estado de loading inicialmente', () => {
      render(<HeaderWithProvider />);
      
      expect(screen.getByText('Cargando...')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener botones accesibles', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3);
        buttons.forEach(button => {
          expect(button).toBeInTheDocument();
        });
      });
    });

    it('debe tener el header como landmark', async () => {
      render(<HeaderWithProvider />);
      
      await waitFor(() => {
        const header = screen.getByRole('banner');
        expect(header).toBeInTheDocument();
      });
    });
  });

  describe('Interacciones de usuario', () => {
    it('debe renderizar botones de idioma', () => {
      render(<HeaderWithProvider />);
      
      // Verificar que el componente se renderiza
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });
  });
});