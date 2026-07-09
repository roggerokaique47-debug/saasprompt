import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrecoPage from '@/app/(public)/preco/page';

describe('PricingPage', () => {
  it('renders all plan names', () => {
    render(<PrecoPage />);
    expect(screen.getByText('Free')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
    expect(screen.getByText('Team')).toBeInTheDocument();
  });

  it('shows Pro as featured plan', () => {
    render(<PrecoPage />);
    expect(screen.getByText('Mais Popular')).toBeInTheDocument();
  });

  it('renders pricing', () => {
    render(<PrecoPage />);
    expect(screen.getByText('R$ 0')).toBeInTheDocument();
    expect(screen.getByText('R$ 29,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 89')).toBeInTheDocument();
  });
});
