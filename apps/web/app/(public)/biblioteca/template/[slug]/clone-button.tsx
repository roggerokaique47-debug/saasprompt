'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface CloneButtonProps {
  workflowId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function CloneButton({ workflowId, className, variant = "default" }: CloneButtonProps) {
  const [isCloning, setIsCloning] = useState(false);
  const router = useRouter();

  const handleClone = async () => {
    setIsCloning(true);
    try {
      const res = await fetch(`/api/workflows/${workflowId}/clone`, {
        method: 'POST',
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao clonar template');
      }

      // Redireciona o usuário para o editor do NOVO workflow criado
      router.push(`/dashboard/workflows/${data.newWorkflowId}/edit`);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsCloning(false);
    }
  };

  return (
    <Button 
      variant={variant} 
      className={className} 
      onClick={handleClone} 
      disabled={isCloning}
    >
      {isCloning ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Clonando...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Clonar Template
        </>
      )}
    </Button>
  );
}
