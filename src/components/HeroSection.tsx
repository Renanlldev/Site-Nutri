'use client';

import React from 'react';
import Image from 'next/image';
import { MessageCircle, Calculator, Sparkles, MapPin, CheckCircle2, HeartHandshake } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeroSectionProps {
  settings: SiteSettings;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  return (
    <section id="hero" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Lado Esquerdo: Conteúdo Textual e Chamada */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6 text-left">
            
            {/* Tag de Modalidade */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5A93C]/20 border border-[#E5A93C]/40 text-[#4A2E18] text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#E87722]" />
              <span>Atendimento Presencial e Online</span>
            </div>

            {/* Headline Principal (Baseado na Identidade Visual) */}
            <h1 className="font-serif-brand text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.15] text-[#3C2212] tracking-tight">
              Aqui a transformação acontece com{' '}
              <span className="text-[#E87722] underline decoration-[#E5A93C]/50 decoration-wavy decoration-2">
                saúde
              </span>
              , constância e{' '}
              <span className="italic font-normal text-[#5A8D56]">zero paranoia.</span>
            </h1>

            {/* Descrição acolhedora */}
            <p className="text-base sm:text-lg text-[#5A4E46] leading-relaxed max-w-2xl font-normal">
              Esqueça dietas punitivas, listas intermináveis de proibições e a culpa ao comer. 
              Com a nutrição certa, você alcança seus objetivos corporais e de saúde com prazer, autonomia e constância para a vida toda.
            </p>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-[#E87722] hover:bg-[#D26414] text-white px-7 py-3.5 rounded-full text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Agendar Consulta</span>
              </a>

              <a
                href="#imc"
                className="inline-flex items-center justify-center gap-2 bg-[#FFFDF9] hover:bg-[#F2ECE1] text-[#3C2212] border border-[#EADBCE] px-6 py-3.5 rounded-full text-base font-semibold shadow-2xs hover:shadow-xs transition-all duration-200"
              >
                <Calculator className="w-5 h-5 text-[#E87722]" />
                <span>Calcular meu IMC</span>
              </a>
            </div>

            {/* Pilares / Provas de Autoridade */}
            <div className="pt-6 border-t border-[#EADBCE]/80 w-full grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-sm text-[#4A3E38]">
                <CheckCircle2 className="w-4 h-4 text-[#5A8D56] shrink-0" />
                <span>Sem dietas restritivas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4A3E38]">
                <MapPin className="w-4 h-4 text-[#E87722] shrink-0" />
                <span>Campo Grande, RJ & Online</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[#4A3E38]">
                <HeartHandshake className="w-4 h-4 text-[#E5A93C] shrink-0" />
                <span>Acompanhamento humanizado</span>
              </div>
            </div>

          </div>

          {/* Lado Direito: Foto Profissional em Cartão Destacado */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            
            {/* Efeito de aura suave */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#E87722]/20 via-[#E5A93C]/15 to-transparent rounded-3xl blur-2xl transform scale-95" />

            {/* Cartão da Foto */}
            <div className="relative w-full max-w-md bg-[#FFFDF9] rounded-3xl p-3 sm:p-4 shadow-xl border border-[#EADBCE] hover-lift">
              <div className="relative h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden bg-[#FAF6F0]">
                <Image
                  src="/images/thaisa-hero.jpeg"
                  alt="Thaísa Felix Nutricionista atendendo no consultório"
                  fill
                  className="object-cover object-top hover:scale-102 transition-transform duration-700"
                  priority
                />
                
                {/* Gradiente inferior para legibilidade */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#23160D]/80 via-transparent to-transparent" />

                {/* Badge Flutuante na Foto */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#FFFDF9]/95 backdrop-blur-md rounded-2xl p-3.5 border border-[#EADBCE] shadow-md flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-brand text-lg font-bold text-[#3C2212] leading-tight">
                      Thaísa Felix
                    </h3>
                    <p className="text-xs text-[#706760] font-medium">
                      Nutricionista Clínica & Comportamental
                    </p>
                  </div>
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#5A8D56]/15 text-[#5A8D56]">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
