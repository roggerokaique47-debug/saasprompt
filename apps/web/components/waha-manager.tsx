"use client";

import React, { useState, useEffect } from 'react';
import { QrCode, Power, Trash, RefreshCw, Bot, Smartphone } from 'lucide-react';

export function WahaManager() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  // Busca as sessões
  const fetchSessions = async () => {
    try {
      const res = await fetch('/api/waha/sessions');
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
        
        // Se a sessão principal estiver no estado SCAN_QR_CODE, ativa o polling do QR
        const userSession = data.length > 0 ? data[0] : null;
        if (userSession?.status === 'SCAN_QR_CODE') {
          setQrCodeUrl(`/api/waha/sessions/${userSession.name}/qr?t=${Date.now()}`); // Cache buster
        } else {
          setQrCodeUrl(null);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Faz polling se tiver alguma sessão precisando de QR
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStartSession = async () => {
    setLoading(true);
    await fetch('/api/waha/sessions', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: { 'Content-Type': 'application/json' }
    });
    fetchSessions();
  };

  const handleStopSession = async () => {
    setLoading(true);
    await fetch('/api/waha/sessions', {
      method: 'DELETE',
    });
    fetchSessions();
  };

  const userSession = sessions.length > 0 ? sessions[0] : null;
  const isWorking = userSession?.status === 'WORKING';
  const isScanning = userSession?.status === 'SCAN_QR_CODE';
  const isStarting = userSession?.status === 'STARTING';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header do Gerenciador */}
      <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 dark:bg-white/5 border border-white/10 backdrop-blur-md">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <Bot className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Agente Inteligente: Atendimento</h2>
            <p className="text-sm text-zinc-400">Conecte o cérebro da Inteligência Artificial ao seu WhatsApp real.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {loading && <RefreshCw className="w-5 h-5 text-zinc-400 animate-spin" />}
          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider
            ${isWorking ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
              isScanning ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : 
              'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
            {isWorking ? 'Conectado' : isScanning ? 'Aguardando QR' : isStarting ? 'Iniciando...' : 'Desconectado'}
          </div>
        </div>
      </div>

      {/* Área de Ação */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Lado Esquerdo: Info */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-indigo-400" />
            Dispositivo
          </h3>
          
          <p className="text-zinc-400 text-sm">
            Para ativar o Agente, clique em iniciar e escaneie o código com o seu aplicativo do WhatsApp, igual você faz no WhatsApp Web.
          </p>

          <div className="flex space-x-4">
            {!userSession || (!isWorking && !isScanning && !isStarting) ? (
              <button 
                onClick={handleStartSession}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-all"
              >
                <Power className="w-4 h-4" />
                Ligar Motor de IA
              </button>
            ) : (
              <button 
                onClick={handleStopSession}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-medium rounded-xl transition-all"
              >
                <Trash className="w-4 h-4" />
                Desconectar Sessão
              </button>
            )}
          </div>
        </div>

        {/* Lado Direito: Visualizador de QR Code */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center min-h-[300px]">
          {isWorking ? (
            <div className="flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                <Bot className="w-12 h-12 text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-400">Motor Ativado</h3>
                <p className="text-sm text-zinc-400 mt-2">
                  Seu número está conectado ao LLM.<br/>Mande uma mensagem pra testar!
                </p>
              </div>
            </div>
          ) : isScanning && qrCodeUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Escaneie o Código</h3>
              <div className="p-4 bg-white rounded-2xl">
                <img src={qrCodeUrl} alt="QR Code WhatsApp" className="w-48 h-48" />
              </div>
            </div>
          ) : isStarting ? (
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
              <p className="text-sm text-zinc-400">Preparando sessão...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 text-zinc-600">
              <QrCode className="w-16 h-16" />
              <p className="text-sm font-medium">Motor Desligado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
