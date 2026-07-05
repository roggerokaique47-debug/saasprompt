'use client';

import { signOut } from '@/features/auth/auth-actions';

export function LogoutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="text-sm text-muted-foreground hover:text-error"
      >
        Sair
      </button>
    </form>
  );
}
