import { render, screen } from '@testing-library/react';
import Home from '../page';

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Home Component', () => {
  it('renders the Next.js logo', () => {
    render(<Home />);
    const logo = screen.getByRole('img', { name: 'Next.js logo' });
    expect(logo).toBeInTheDocument();
  });

  it('renders the link to Page', () => {
    render(<Home />);
    const link = screen.getByText('Ir a Page');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/page?id=1');
  });

  it('renders the getting started text', () => {
    render(<Home />);
    expect(screen.getByText(/Get started by editing/)).toBeInTheDocument();
  });
});