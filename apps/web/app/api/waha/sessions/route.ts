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
    
    // Multi-tenant: Filtra a lista inteira do servidor para retornar APENAS a sessão do usuário logado
    const userSessionName = `session_${user.id}`;
    const userSessions = data.filter((s: any) => s.name === userSessionName);

    return NextResponse.json(userSessions);
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
    // IGNORA o body do frontend. A SESSÃO É FORÇADA PELO BACK-END
    const sessionName = `session_${user.id}`;

    // Configuramos explicitamente a URL de Webhook do nosso SaaS
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://host.docker.internal:3000';
    
    // Primeiro tenta criar a sessão com o webhook
    let response = await fetch(`${WAHA_URL}/api/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      },
      body: JSON.stringify({
        name: sessionName,
        config: {
          webhooks: [
            {
              url: `${appUrl}/api/waha/webhook`,
              events: ['message', 'session.status']
            }
          ]
        }
      })
    });

    // Se já existir (409 Conflict), tentamos dar o 'start' normal
    if (response.status === 409 || response.status === 400) {
      response = await fetch(`${WAHA_URL}/api/sessions/${sessionName}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Api-Key': WAHA_API_KEY
        }
      });
    }

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

/**
 * DELETE /api/waha/sessions
 * Para e deleta a sessão atual do usuário
 */
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sessionName = `session_${user.id}`;
    
    // Deleta a sessão baseada no ID do usuário ignorando parâmetros externos
    const response = await fetch(`${WAHA_URL}/api/sessions/${sessionName}/stop`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok && response.status !== 404) {
      throw new Error(`Failed to stop session: ${response.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[WAHA API ERROR] DELETE /sessions:', error);
    return NextResponse.json({ error: 'Failed to delete WAHA session' }, { status: 500 });
  }
}
