'use client';

import React from 'react';
import Image from 'next/image';
import { Apple, Heart, Target, MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface AboutSectionProps {
  settings: SiteSettings;
}

export default function AboutSection({ settings }: AboutSectionProps) {
  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  // Dividir o texto da bio em parágrafos preservando quebras de linha
  const paragraphs = settings.bio_content
    ? settings.bio_content.split('\n\n').filter((p) => p.trim() !== '')
    : [];

  return (
    <section id="sobre" className="py-20 sm:py-28 bg-[#FFFDF9]/80 border-y border-[#EADBCE]/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Título de Seção */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#E87722] uppercase">
            Conheça sua Nutricionista
          </span>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C2212] mt-2">
            {settings.bio_title || 'Quem Sou Eu'}
          </h2>
          <div className="w-16 h-1 bg-[#E5A93C] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Lado Esquerdo: Imagem / Logo com elementos visuais de frutas */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-4/5 rounded-3xl overflow-hidden shadow-lg border-2 border-[#EADBCE] bg-[#FAF6F0]">
              <Image
                src="/images/fruits-frame.jpeg"
                alt="Identidade visual Thaísa Felix Nutricionista"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#3C2212]/30 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 bg-[#FAF6F0]/95 backdrop-blur-xs p-4 rounded-2xl border border-[#EADBCE] text-center shadow-md">
                <p className="font-serif-brand text-xl font-bold text-[#3C2212]">
                  Thaísa Felix
                </p>
                <p className="text-xs text-[#706760] font-medium uppercase tracking-wider">
                  Nutricionista Clínica
                </p>
              </div>
            </div>
          </div>

          {/* Lado Direito: Bio Editável & Filosofia de Atendimento */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Texto da Bio dinâmico */}
            <div className="space-y-4 text-base sm:text-lg text-[#5A4E46] leading-relaxed">
              {paragraphs.length > 0 ? (
                paragraphs.map((para, index) => {
                  const lines = para.split('\n').map((l) => l.trim()).filter(Boolean);
                  const isList = lines.length > 0 && lines.every((l) => l.startsWith('-') || l.startsWith('•'));

                  if (isList) {
                    return (
                      <ul key={index} className="space-y-2.5 my-3 pl-1 bg-[#FAF6F0]/80 p-4 rounded-2xl border border-[#EADBCE]/80">
                        {lines.map((line, lineIdx) => (
                          <li key={lineIdx} className="flex items-start gap-2.5 text-base sm:text-lg font-medium text-[#3C2212]">
                            <span className="w-2 h-2 rounded-full bg-[#E87722] shrink-0 mt-2.5 shadow-2xs" />
                            <span>{line.replace(/^[-•]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }

                  return (
                    <p key={index} className="whitespace-pre-line">
                      {para}
                    </p>
                  );
                })
              ) : (
                <p>
                  Sou nutricionista apaixonada por descomplicar a alimentação e transformar vidas através de escolhas saudáveis, conscientes e sustentáveis. A verdadeira transformação acontece com saúde, constância e zero paranoia.
                </p>
              )}
            </div>

            {/* Três Pilares do Atendimento */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADBCE]/80 hover-lift">
                <div className="w-10 h-10 rounded-xl bg-[#E87722]/15 text-[#E87722] flex items-center justify-center mb-3">
                  <Apple className="w-5 h-5" />
                </div>
                <h4 className="font-serif-brand font-bold text-[#3C2212] text-base mb-1">
                  Comida de Verdade
                </h4>
                <p className="text-xs text-[#706760] leading-relaxed">
                  Sem fórmulas mágicas ou custos desnecessários. Ingredientes reais e acessíveis.
                </p>
              </div>

              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADBCE]/80 hover-lift">
                <div className="w-10 h-10 rounded-xl bg-[#5A8D56]/15 text-[#5A8D56] flex items-center justify-center mb-3">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="font-serif-brand font-bold text-[#3C2212] text-base mb-1">
                  Constância
                </h4>
                <p className="text-xs text-[#706760] leading-relaxed">
                  Metas possíveis e progressivas que você consegue manter por toda a vida.
                </p>
              </div>

              <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADBCE]/80 hover-lift">
                <div className="w-10 h-10 rounded-xl bg-[#E5A93C]/20 text-[#A87216] flex items-center justify-center mb-3">
                  <Heart className="w-5 h-5" />
                </div>
                <h4 className="font-serif-brand font-bold text-[#3C2212] text-base mb-1">
                  Zero Paranoia
                </h4>
                <p className="text-xs text-[#706760] leading-relaxed">
                  Comer com prazer, sem sentimentos de culpa ou medo de confraternizar.
                </p>
              </div>
            </div>

            {/* CTA para conversa */}
            <div className="pt-4 flex items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#4A2E18] hover:bg-[#3C2212] text-white px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#E5A93C]" />
                <span>Conversar com a Thaísa</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
