'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Smartphone, QrCode, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SessionStatus {
  status: 'STOPPED' | 'STARTING' | 'SCAN_QR_CODE' | 'WORKING' | 'FAILED' | 'UNKNOWN';
}

interface QrResponse {
  session: string;
  format: string;
  raw: string; // The base64 image data
}

export function WahaConnector({ userId }: { userId: string }) {
  const sessionId = `session_${userId}`;
  const [status, setStatus] = useState<SessionStatus['status']>('UNKNOWN');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch(`/api/waha/sessions/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        // WAHA returns status as a string, sometimes wrapped
        const currentStatus = data.status || 'STOPPED';
        setStatus(currentStatus);
        
        if (currentStatus === 'SCAN_QR_CODE') {
          fetchQrCode();
        } else if (currentStatus === 'WORKING' || currentStatus === 'STOPPED' || currentStatus === 'FAILED') {
          setQrCode(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch status', error);
      setStatus('UNKNOWN');
    } finally {
      setLoading(false);
    }
  };

  const fetchQrCode = async () => {
    try {
      const res = await fetch(`/api/waha/sessions/${sessionId}/qr`);
      if (res.ok) {
        const data: QrResponse = await res.json();
        if (data.raw) {
          setQrCode(data.raw);
        }
      }
    } catch (error) {
      console.error('Failed to fetch QR', error);
    }
  };

  const startSession = async () => {
    setActionLoading(true);
    try {
      await fetch('/api/waha/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sessionId })
      });
      // Start intense polling for QR code
      setStatus('STARTING');
      fetchStatus();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Poll every 3 seconds if we are starting or waiting for scan
    pollingRef.current = setInterval(() => {
      setStatus((current) => {
        if (current === 'STARTING' || current === 'SCAN_QR_CODE') {
          fetchStatus();
        }
        return current;
      });
    }, 3000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Verificando conexões...</p>
        </div>
      );
    }

    if (status === 'WORKING') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-900">WhatsApp Conectado!</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Seu robô está online e pronto para executar automações.
          </p>
        </div>
      );
    }

    if (status === 'SCAN_QR_CODE') {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="mb-6 rounded-2xl border-4 border-dashed border-border p-4">
            {qrCode ? (
              <img src={qrCode} alt="WhatsApp QR Code" className="h-64 w-64 rounded-xl" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-xl bg-muted/50">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-bold">Leia o QR Code</h3>
          <p className="mt-2 max-w-xs text-center text-sm text-muted-foreground">
            Abra o WhatsApp no seu celular, vá em "Aparelhos Conectados" e escaneie este código.
          </p>
        </div>
      );
    }

    if (status === 'STARTING') {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-primary" />
          <h3 className="text-lg font-bold">Iniciando Servidor...</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Estamos gerando um QR Code para você. Aguarde alguns segundos.
          </p>
        </div>
      );
    }

    // Default to STOPPED or FAILED
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <Smartphone className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold">WhatsApp Desconectado</h3>
        <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
          Conecte o seu número para habilitar o envio e recebimento de mensagens pelas automações.
        </p>
        <Button 
          onClick={startSession} 
          disabled={actionLoading}
          className="mt-8 px-8 py-6 text-lg"
        >
          {actionLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <QrCode className="mr-2 h-5 w-5" />}
          Conectar Agora
        </Button>
      </div>
    );
  };

  return (
    <Card className="mx-auto w-full max-w-2xl overflow-hidden border-2 shadow-lg">
      <CardHeader className="border-b bg-muted/30 pb-6">
        <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight">
          <Smartphone className="h-6 w-6 text-primary" />
          Aparelho Conectado
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Gerencie a conexão do seu WhatsApp com o NovaFlow AI.
        </p>
      </CardHeader>
      <CardContent className="bg-gradient-to-b from-white to-muted/10 p-0">
        {renderContent()}
      </CardContent>
    </Card>
  );
}
