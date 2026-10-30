'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, X } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface FloatingWhatsAppProps {
  settings: SiteSettings;
}

export default function FloatingWhatsApp({ settings }: FloatingWhatsAppProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 select-none">
      
      {/* Balão de Notificação Acolhedora */}
      {showTooltip && (
        <div className="bg-[#FFFDF9] rounded-2xl p-3.5 shadow-xl border border-[#EADBCE] max-w-[270px] animate-in fade-in slide-in-from-bottom-2 duration-300 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-[#A89E96] hover:text-[#3C2212] p-1 rounded-full"
            aria-label="Fechar balão"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#E87722]">
              <Image
                src="/images/logo.jpeg"
                alt="Thaísa Felix"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs font-bold text-[#3C2212] leading-tight">
                Thaísa Felix
              </p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                <span className="text-[10px] text-[#5A8D56] font-semibold">
                  Online para agendamento
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#5A4E46] leading-relaxed">
            Olá! Que tal conversarmos sobre como transformar sua saúde sem dietas restritivas?
          </p>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 block text-center text-xs font-bold text-[#1EBE5D] bg-[#25D366]/10 hover:bg-[#25D366]/20 py-1.5 rounded-lg transition-colors"
          >
            Iniciar Conversa no WhatsApp
          </a>
        </div>
      )}

      {/* Botão Flutuante Circular com Efeito de Pulso */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a nutricionista Thaísa Felix pelo WhatsApp"
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-xl animate-soft-pulse transition-transform hover:scale-110 active:scale-95"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8" />
      </a>
    </div>
  );
}
