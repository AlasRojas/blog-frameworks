import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalComponent from '../modal';

// Mock flowbite-react components
vi.mock('flowbite-react', () => ({
  Modal: ({ children, show, onClose }: { children: React.ReactNode, show: boolean, onClose: () => void }) => {
    if (!show) return null;
    return (
      <div data-testid="modal-container" role="dialog">
        <div data-testid="modal-backdrop" onClick={onClose} />
        <div data-testid="modal-content">
          {children}
        </div>
      </div>
    );
  },
  ModalHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-header">{children}</div>
  ),
  ModalBody: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="modal-body">{children}</div>
  ),
}));

describe('ModalComponent', () => {
  const mockHandleClose = vi.fn();
  const defaultProps = {
    isOpen: true,
    handleClose: mockHandleClose,
    children: <div>Test modal content</div>
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Renderizado básico', () => {
    it('debe renderizar cuando isOpen es true', () => {
      render(<ModalComponent {...defaultProps} />);
      
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('no debe renderizar cuando isOpen es false', () => {
      render(<ModalComponent {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('debe mostrar el título "Terms of Service" en el header', () => {
      render(<ModalComponent {...defaultProps} />);
      
      expect(screen.getByTestId('modal-header')).toBeInTheDocument();
      expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    });

    it('debe renderizar el contenido children en el body', () => {
      render(<ModalComponent {...defaultProps} />);
      
      expect(screen.getByTestId('modal-body')).toBeInTheDocument();
      expect(screen.getByText('Test modal content')).toBeInTheDocument();
    });
  });

  describe('Funcionalidad de cierre', () => {
    it('debe llamar handleClose con false cuando se hace clic en el backdrop', () => {
      render(<ModalComponent {...defaultProps} />);
      
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      
      expect(mockHandleClose).toHaveBeenCalledWith(false);
      expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });

    it('debe tener la función closeModal definida correctamente', () => {
      render(<ModalComponent {...defaultProps} />);
      
      // Simular el evento onClose del Modal
      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);
      
      expect(mockHandleClose).toHaveBeenCalledWith(false);
    });
  });

  describe('Props y tipos', () => {
    it('debe aceptar diferentes tipos de children', () => {
      const complexChildren = (
        <div>
          <h2>Complex Content</h2>
          <p>This is a paragraph</p>
          <button>Action Button</button>
        </div>
      );
      
      render(<ModalComponent {...defaultProps}>{complexChildren}</ModalComponent>);
      
      expect(screen.getByText('Complex Content')).toBeInTheDocument();
      expect(screen.getByText('This is a paragraph')).toBeInTheDocument();
      expect(screen.getByText('Action Button')).toBeInTheDocument();
    });

    it('debe manejar children como string', () => {
      render(<ModalComponent {...defaultProps}>Simple text content</ModalComponent>);
      
      expect(screen.getByText('Simple text content')).toBeInTheDocument();
    });

    it('debe manejar children vacío', () => {
      render(<ModalComponent {...defaultProps}>{null}</ModalComponent>);
      
      expect(screen.getByTestId('modal-body')).toBeInTheDocument();
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    });
  });

  describe('Estados del modal', () => {
    it('debe cambiar de cerrado a abierto', () => {
      const { rerender } = render(<ModalComponent {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
      
      rerender(<ModalComponent {...defaultProps} isOpen={true} />);
      
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    });

    it('debe cambiar de abierto a cerrado', () => {
      const { rerender } = render(<ModalComponent {...defaultProps} isOpen={true} />);
      
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
      
      rerender(<ModalComponent {...defaultProps} isOpen={false} />);
      
      expect(screen.queryByTestId('modal-container')).not.toBeInTheDocument();
    });
  });

  describe('Estructura del componente', () => {
    it('debe tener la estructura correcta con header y body', () => {
      render(<ModalComponent {...defaultProps} />);
      
      const container = screen.getByTestId('modal-container');
      const header = screen.getByTestId('modal-header');
      const body = screen.getByTestId('modal-body');
      
      expect(container).toBeInTheDocument();
      expect(header).toBeInTheDocument();
      expect(body).toBeInTheDocument();
    });

    it('debe mantener el orden correcto de elementos', () => {
      render(<ModalComponent {...defaultProps} />);
      
      const content = screen.getByTestId('modal-content');
      const header = screen.getByTestId('modal-header');
      const body = screen.getByTestId('modal-body');
      
      expect(content).toContainElement(header);
      expect(content).toContainElement(body);
    });
  });

  describe('Accesibilidad', () => {
    it('debe tener el rol dialog', () => {
      render(<ModalComponent {...defaultProps} />);
      
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('debe ser accesible cuando está abierto', () => {
      render(<ModalComponent {...defaultProps} />);
      
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('data-testid', 'modal-container');
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar handleClose undefined sin errores', () => {
      const propsWithoutHandler = {
        isOpen: true,
        handleClose: undefined as (() => void) | undefined,
        children: <div>Test content</div>
      };
      
      expect(() => {
        render(<ModalComponent {...propsWithoutHandler} />);
      }).not.toThrow();
    });

    it('debe renderizar sin children', () => {
      const propsWithoutChildren = {
        isOpen: true,
        handleClose: mockHandleClose,
        children: undefined as React.ReactNode
      };
      
      expect(() => {
        render(<ModalComponent {...propsWithoutChildren} />);
      }).not.toThrow();
      
      expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    });
  });
});