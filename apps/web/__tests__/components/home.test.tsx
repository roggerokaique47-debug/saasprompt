import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn(() => ({ data: { user: null } })),
    },
  })),
}));

vi.mock('@prompthub/database/src/client', () => ({
  default: {
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(() => ({
            limit: vi.fn(() => Promise.resolve([])),
          })),
        })),
        leftJoin: vi.fn(() => ({
          groupBy: vi.fn(() => ({
            orderBy: vi.fn(() => Promise.resolve([])),
          })),
        })),
      })),
    })),
  },
}));

import Home from '@/app/(public)/page';

describe('HomePage', () => {
  it('renders the hero heading', async () => {
    const Component = await Home();
    render(Component);
    expect(screen.getByText(/Crie fluxos de IA/i)).toBeInTheDocument();
  });

  it('renders explorar button', async () => {
    const Component = await Home();
    render(Component);
    expect(screen.getAllByText(/Ver como funciona/i).length).toBeGreaterThanOrEqual(1);
  });

  it('renders CTA section', async () => {
    const Component = await Home();
    render(Component);
    expect(screen.getAllByText(/Garantir Acesso Antecipado/i).length).toBeGreaterThanOrEqual(1);
  });
});
