'use client';

import React from 'react';
import { SiteSettings } from '@/lib/types';

interface BackgroundWrapperProps {
  settings: SiteSettings;
  children: React.ReactNode;
}

export default function BackgroundWrapper({ settings, children }: BackgroundWrapperProps) {
  const theme = settings.background_theme || 'organic_fruits';

  // Se houver uma imagem personalizada configurada
  if (theme === 'custom_image' && settings.custom_bg_url) {
    return (
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed transition-all duration-500"
        style={{ backgroundImage: `url(${settings.custom_bg_url})` }}
      >
        <div className="min-h-screen bg-[#FAF6F0]/90 backdrop-blur-[2px]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen theme-${theme} transition-colors duration-500 overflow-hidden`}>
      {/* Elementos decorativos aquarelados orgânicos para o tema padrão */}
      {theme === 'organic_fruits' && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-35 transition-opacity duration-700">
          {/* Canto superior esquerdo - Rodela de Laranja sutil */}
          <div className="absolute -top-12 -left-12 w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-gradient-to-br from-[#E87722]/15 to-[#E5A93C]/10 blur-xl animate-pulse" />
          
          {/* Canto superior direito - Morango / Tom rubro saudável */}
          <div className="absolute top-16 -right-16 w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-gradient-to-bl from-[#D9383A]/10 to-[#E87722]/5 blur-2xl" />
          
          {/* Canto inferior esquerdo - Abacaxi / Dourado natural */}
          <div className="absolute bottom-24 -left-16 w-60 h-60 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#E5A93C]/15 to-[#5A8D56]/5 blur-2xl" />
          
          {/* Canto inferior direito - Caju / Laranja & Verde */}
          <div className="absolute -bottom-16 -right-12 w-64 h-64 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tl from-[#E87722]/12 to-[#4E824A]/10 blur-2xl" />

          {/* Ondas orgânicas translúcidas suaves de fundo */}
          <svg
            className="absolute top-1/4 -left-20 w-[140%] max-w-none opacity-20 pointer-events-none"
            viewBox="0 0 1440 320"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,224C960,245,1056,235,1152,202.7C1248,171,1344,117,1392,90.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              fill="#EADBC8"
            />
          </svg>
        </div>
      )}

      {/* Conteúdo da Aplicação */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
