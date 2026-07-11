import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrecoPage from '@/app/(public)/preco/page';

describe('PricingPage', () => {
  it('renders all plan names', () => {
    render(<PrecoPage />);
    expect(screen.getByText('Free', { selector: '.plan-name' })).toBeInTheDocument();
    expect(screen.getByText('Pro', { selector: '.plan-name' })).toBeInTheDocument();
    expect(screen.getByText('Enterprise', { selector: '.plan-name' })).toBeInTheDocument();
    expect(screen.getByText('Lifetime (Founder)', { selector: '.plan-name' })).toBeInTheDocument();
  });

  it('shows Pro as featured plan', () => {
    render(<PrecoPage />);
    const featuredCard = screen.getByText('Pro', { selector: '.plan-name' }).closest('.plan-card');
    expect(featuredCard).toHaveClass('featured');
    expect(featuredCard).toHaveAttribute('data-badge', 'MAIS POPULAR');
  });

  it('renders pricing', () => {
    render(<PrecoPage />);
    expect(screen.getByText('R$ 0')).toBeInTheDocument();
    expect(screen.getByText('R$ 97')).toBeInTheDocument();
    expect(screen.getByText('Sob consulta')).toBeInTheDocument();
    expect(screen.getByText('R$ 997')).toBeInTheDocument();
  });
});
