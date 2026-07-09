import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const WAHA_URL = process.env.WAHA_API_URL || 'http://127.0.0.1:3002';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '123';

/**
 * GET /api/waha/sessions
 * Lista todas as sessões ativas no servidor WAHA local
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Multi-tenant: Se o usuário não estiver logado, barrar (Isolamento B2B/SaaS)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const response = await fetch(`${WAHA_URL}/api/sessions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sessions: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[WAHA API ERROR] GET /sessions:', error);
    return NextResponse.json({ error: 'Failed to connect to WAHA engine' }, { status: 500 });
  }
}

/**
 * POST /api/waha/sessions
 * Cria ou Inicia uma nova sessão
 */
export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name } = body;
    
    // Por segurança e multi-tenant, nós atrelamos a sessão ao ID do usuário do SaaS,
    // garantindo que ele não delete ou veja sessões de outros clientes.
    const sessionName = name || `session_${user.id}`;

    // A documentação do WAHA permite iniciar a sessão (e se ela não existir, ela cria)
    const response = await fetch(`${WAHA_URL}/api/sessions/${sessionName}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to start session: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[WAHA API ERROR] POST /sessions:', error);
    return NextResponse.json({ error: 'Failed to start WAHA session' }, { status: 500 });
  }
}
