import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const WAHA_URL = process.env.WAHA_API_URL || 'http://127.0.0.1:3002';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '123';

/**
 * GET /api/waha/sessions/[id]
 * Consulta o status de uma sessão específica no WAHA
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    
    // Segurança B2B: Garantir que o usuário só consiga ver a própria sessão.
    // O id da sessão DEVE começar com "session_" + user.id
    if (id !== `session_${user.id}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const response = await fetch(`${WAHA_URL}/api/sessions/${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ status: 'STOPPED' }, { status: 200 }); // Se não existe, está parado.
      }
      throw new Error(`Failed to fetch session status: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[WAHA API ERROR] GET /sessions/[id]:', error);
    return NextResponse.json({ error: 'Failed to connect to WAHA engine' }, { status: 500 });
  }
}
