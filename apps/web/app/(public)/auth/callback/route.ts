import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/admin';

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Sincronizar o usuário com a tabela pública e criar organização pessoal (Escudo B2B)
      const db = (await import('@prompthub/database/src/client')).default;
      const { users } = await import('@prompthub/database/src/schema/users');
      const { organizations, members } = await import('@prompthub/database/src/schema/organizations');
      const crypto = await import('crypto');
      const { eq } = await import('drizzle-orm');
      
      const existingUser = await db.select().from(users).where(eq(users.id, data.user.id)).limit(1);

      if (existingUser.length === 0) {
        await db.transaction(async (tx) => {
          const personalOrgId = crypto.randomUUID();
          const name = data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Usuário';

          await tx.insert(organizations).values({
            id: personalOrgId,
            name: `Org de ${name}`,
            slug: `org-${data.user.id.substring(0, 8)}`,
            ownerId: data.user.id,
            plan: 'free',
            credits: 100, // Escudo SaaS - 100 Tokens gratuitos no cadastro
          });

          await tx.insert(users).values({
            id: data.user.id,
            email: data.user.email || '',
            name,
            avatarUrl: data.user.user_metadata?.avatar_url || null,
            organizationId: personalOrgId,
          });

          await tx.insert(members).values({
            organizationId: personalOrgId,
            userId: data.user.id,
            role: 'owner',
            joinedAt: new Date(),
          });
        });
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
