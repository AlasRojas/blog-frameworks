import { render, screen } from '@testing-library/react';
import Entry from '../page';

describe('Entry Component', () => {
  beforeEach(() => {
    render(<Entry />);
  });

  it('renders the title', () => {
    expect(screen.getByText('Title 123')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    expect(screen.getByText('Explicación Técnica')).toBeInTheDocument();
    expect(screen.getByText('Explicación Ejemplificada')).toBeInTheDocument();
    expect(screen.getByText('Tabla comparativa')).toBeInTheDocument();
  });

  it('renders the comparison table with correct headers', () => {
    expect(screen.getByText('Diferencias')).toBeInTheDocument();
    expect(screen.getByText('Similitudes')).toBeInTheDocument();
  });

  it('renders framework buttons', () => {
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(3);
    expect(buttons.some(button => button.textContent === 'Angular')).toBe(true);
    expect(buttons.some(button => button.textContent === 'React')).toBe(true);
    expect(buttons.some(button => button.textContent === 'Vue')).toBe(true);
  });

  it('renders framework selection dropdowns', () => {
    const selects = screen.getAllByRole('combobox');
    expect(selects).toHaveLength(2);
  });
});