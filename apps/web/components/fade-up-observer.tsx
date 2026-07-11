'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function FadeUpObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Cria o observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Para de observar depois que anima uma vez
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Um pequeno timeout para garantir que o React já montou o DOM na troca de rotas
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.fade-up:not(.in)');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
