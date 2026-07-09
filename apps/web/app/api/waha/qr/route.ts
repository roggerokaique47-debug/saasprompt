import { NextResponse } from 'next/server';

const WAHA_API_URL = 'http://127.0.0.1:3002/api';
const WAHA_API_KEY = '123';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionName = searchParams.get('session') || 'default';

    const response = await fetch(`${WAHA_API_URL}/${sessionName}/auth/qr`, {
      headers: {
        'Accept': 'image/png',
        'X-Api-Key': WAHA_API_KEY
      }
    });

    if (!response.ok) {
      // Pode ser 404 se a sessão não existir ou o QR não estiver pronto
      return new NextResponse(null, { status: response.status });
    }

    // Retorna a imagem bruta como PNG para o front-end exibir na tag <img />
    const imageBuffer = await response.arrayBuffer();
    
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store'
      }
    });

  } catch (error) {
    console.error('[WAHA QR GET ERROR]', error);
    return new NextResponse(null, { status: 500 });
  }
}
