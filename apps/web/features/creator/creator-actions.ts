import 'server-only';
import { createClient } from '@/lib/supabase/server';
import db from '@prompthub/database/src/client';
import { creators } from '@prompthub/database/src/schema/creators';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

export async function getCurrentCreator() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/dashboard/criador');
  }

  const [creator] = await db
    .select()
    .from(creators)
    .where(eq(creators.userId, user.id))
    .limit(1);

  if (!creator) {
    redirect('/comunidade');
  }

  return { user, creator };
}
