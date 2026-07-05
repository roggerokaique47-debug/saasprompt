'use client';

import { useState } from 'react';

interface CopyButtonProps {
  content: string;
  variant?: 'icon' | 'large';
}

export function CopyButton({ content, variant = 'icon' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (variant === 'large') {
    return (
      <button
        onClick={handleCopy}
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
      >
        {copied ? '✅ Copiado!' : '📋 Copiar Prompt'}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
    >
      {copied ? 'Copiado!' : 'Copiar'}
    </button>
  );
}
