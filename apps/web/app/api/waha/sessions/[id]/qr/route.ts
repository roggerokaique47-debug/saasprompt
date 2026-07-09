import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const WAHA_URL = process.env.WAHA_API_URL || 'http://127.0.0.1:3002';
const WAHA_API_KEY = process.env.WAHA_API_KEY || '123';

/**
 * GET /api/waha/sessions/[id]/qr
 * Retorna o QR Code da sessão no WAHA
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
    
    if (id !== `session_${user.id}`) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // A documentação do WAHA permite pedir JSON (format=raw costuma voltar a string em base64/data URI)
    const response = await fetch(`${WAHA_URL}/api/sessions/${id}/auth/qr?format=raw`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }
      throw new Error(`Failed to fetch QR Code: ${response.statusText}`);
    }

    // Exemplo de retorno da WAHA: { session: "...", format: "raw", raw: "data:image/png;base64,..." }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[WAHA API ERROR] GET /sessions/[id]/qr:', error);
    return NextResponse.json({ error: 'Failed to connect to WAHA engine' }, { status: 500 });
  }
}
