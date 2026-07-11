'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

export function RoiCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [hourlyRate, setHourlyRate] = useState(50);

  // 4 semanas no mês = horas no mes
  const hoursPerMonth = hoursPerWeek * 4;
  const costPerMonth = hoursPerMonth * hourlyRate;
  
  // O plano Pro custa R$ 97
  const proCost = 97;
  const savingsPerMonth = Math.max(0, costPerMonth - proCost);
  const savingsPerYear = savingsPerMonth * 12;

  // Determine color intensity based on savings
  const intensity = Math.min(100, (savingsPerMonth / 5000) * 100);

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 mb-4">
          Comprovado em Dados
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight">Calculadora de ROI</h2>
        <p className="mt-4 text-lg text-muted-foreground">Descubra o quanto você economiza automatizando suas tarefas repetitivas.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Card className="overflow-hidden border-0 shadow-2xl ring-1 ring-border/50 bg-white/50 dark:bg-black/40 backdrop-blur-3xl rounded-3xl">
          <div className="grid md:grid-cols-2">
            
            <CardContent className="p-10 border-b md:border-b-0 md:border-r border-border/50">
              <h3 className="mb-8 font-bold text-xl flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
                Preencha seus dados
              </h3>
              
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-foreground">Horas manuais por semana</label>
                    <span className="text-2xl font-black text-primary">{hoursPerWeek}h</span>
                  </div>
                  <div className="relative pt-2">
                    <input 
                      type="range" 
                      min="1" 
                      max="100" 
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Tempo gasto com emails, planilhas e copy-paste.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-semibold text-foreground">Custo da Hora (R$)</label>
                    <span className="text-2xl font-black text-primary">R$ {hourlyRate}</span>
                  </div>
                  <div className="relative pt-2">
                    <input 
                      type="range" 
                      min="10" 
                      max="500" 
                      step="5"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">Quanto vale a sua hora ou a hora do seu time.</p>
                </div>
              </div>
            </CardContent>

            <motion.div 
              className="p-10 flex flex-col justify-center items-center text-center relative overflow-hidden"
              animate={{
                backgroundColor: `rgba(34, 197, 94, ${0.02 + (intensity / 100) * 0.1})`
              }}
              transition={{ duration: 0.5 }}
            >
              {/* Animated decorative shapes */}
              <motion.div 
                className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-green-500/20 blur-[80px]"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div 
                className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-primary/20 blur-[80px]"
                animate={{ scale: [1.2, 1, 1.2] }}
                transition={{ duration: 5, repeat: Infinity }}
              />

              <div className="relative z-10 w-full">
                <h3 className="mb-4 font-semibold text-muted-foreground uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500/20 text-green-600 text-xs">2</span>
                  Economia Estimada
                </h3>
                
                <div className="my-8">
                  <motion.div
                    key={savingsPerMonth}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl md:text-7xl font-black text-green-500 drop-shadow-sm tracking-tighter"
                  >
                    R$ {savingsPerMonth.toLocaleString('pt-BR')}
                  </motion.div>
                  <span className="block mt-4 text-sm font-bold text-slate-400 uppercase tracking-widest">/ ao mês</span>
                </div>
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full bg-white/60 dark:bg-black/60 backdrop-blur-md p-6 rounded-2xl border border-green-500/20 shadow-xl"
                >
                  <p className="text-green-700 dark:text-green-400 text-sm md:text-base leading-relaxed">
                    Isso representa impressionantes <br/>
                    <strong className="text-xl md:text-2xl font-black block mt-2">R$ {savingsPerYear.toLocaleString('pt-BR')}</strong> 
                    <span className="block mt-1">de lucro extra por ano!</span>
                  </p>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </Card>
      </motion.div>
    </div>
  );
}
