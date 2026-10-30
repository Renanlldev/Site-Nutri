'use client';

import React from 'react';
import { MapPin, Video, Sparkles, Check, ArrowRight, MessageCircle } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface ProgramsSectionProps {
  settings: SiteSettings;
}

export default function ProgramsSection({ settings }: ProgramsSectionProps) {
  const getWhatsAppLink = (serviceName: string) => {
    const text = `Olá, Thaísa! Gostaria de saber mais informações e agendar o ${serviceName}.`;
    return `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(text)}`;
  };

  const programs = [
    {
      id: 'presencial',
      icon: MapPin,
      badge: 'Campo Grande - RJ',
      title: 'Atendimento Presencial',
      subtitle: 'Consulta completa e acolhedora em consultório',
      description:
        'Ideal para quem busca contato direto, avaliação física detalhada e um espaço acolhedor para conversar sobre sua saúde e objetivos.',
      features: [
        'Avaliação antropométrica detalhada',
        'Análise da rotina, exames e preferências alimentares',
        'Plano alimentar individualizado e adaptável',
        'Receitas práticas para o seu dia a dia',
        'Suporte contínuo via WhatsApp para tirar dúvidas',
      ],
      ctaText: 'Agendar Presencial',
      highlighted: false,
    },
    {
      id: 'online',
      icon: Video,
      badge: 'Brasil & Exterior',
      title: 'Atendimento Online',
      subtitle: 'A mesma qualidade no conforto da sua casa',
      description:
        'Consulta realizada via videochamada para qualquer lugar do mundo. Praticidade sem perder o acolhimento e o rigor técnico.',
      features: [
        'Consulta completa por videoconferência',
        'Análise de exames laboratoriais e histórico clínico',
        'Plano alimentar digital entregue com rapidez',
        'Orientações para medições e fotos de evolução',
        'Canal direto no WhatsApp para acompanhamento',
      ],
      ctaText: 'Agendar Online',
      highlighted: true,
    },
    {
      id: 'acompanhamento',
      icon: Sparkles,
      badge: 'Foco em Constância',
      title: 'Acompanhamento Contínuo',
      subtitle: 'Reeducação alimentar definitiva e sem paranoia',
      description:
        'Pacotes com acompanhamento periódico para quem deseja construir hábitos saudáveis e sustentáveis com apoio próximo e suporte constante.',
      features: [
        'Consultas de retorno e ajustes estratégicos',
        'Metas graduais para evitar o efeito sanfona',
        'Estratégias para eventos sociais e finais de semana',
        'Foco na saúde da mulher e melhora da digestão',
        'Celebração de cada vitória no seu ritmo',
      ],
      ctaText: 'Saber Sobre Pacotes',
      highlighted: false,
    },
  ];

  return (
    <section id="programas" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#E87722] uppercase">
            Modalidades de Consulta
          </span>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C2212] mt-2">
            Programas & Atendimentos
          </h2>
          <p className="text-[#5A4E46] text-base sm:text-lg mt-3">
            Escolha o formato que melhor se adapta à sua rotina e comece hoje sua jornada de transformação.
          </p>
          <div className="w-16 h-1 bg-[#E5A93C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Grade de Programas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {programs.map((prog) => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 transition-all duration-300 relative ${
                  prog.highlighted
                    ? 'bg-[#FFFDF9] border-2 border-[#E87722] shadow-xl hover:-translate-y-2'
                    : 'bg-[#FFFDF9]/90 border border-[#EADBCE] shadow-sm hover:shadow-lg hover:-translate-y-1'
                }`}
              >
                {/* Destaque Recomendado */}
                {prog.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#E87722] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                    Mais Procurado
                  </div>
                )}

                <div>
                  {/* Topo do Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        prog.highlighted
                          ? 'bg-[#E87722] text-white'
                          : 'bg-[#FAF6F0] text-[#E87722] border border-[#EADBCE]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FAF6F0] text-[#706760] border border-[#EADBCE]">
                      {prog.badge}
                    </span>
                  </div>

                  <h3 className="font-serif-brand text-2xl font-bold text-[#3C2212] mb-1">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-[#E87722] font-semibold mb-3">
                    {prog.subtitle}
                  </p>
                  <p className="text-sm text-[#706760] leading-relaxed mb-6">
                    {prog.description}
                  </p>

                  {/* Lista de Recursos */}
                  <div className="space-y-3 pt-4 border-t border-[#EADBCE]/80">
                    {prog.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#4A3E38]">
                        <Check className="w-4 h-4 text-[#5A8D56] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Botão de Ação */}
                <div className="pt-8">
                  <a
                    href={getWhatsAppLink(prog.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-full text-sm font-semibold transition-all duration-200 ${
                      prog.highlighted
                        ? 'bg-[#E87722] hover:bg-[#D26414] text-white shadow-md hover:shadow-lg'
                        : 'bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#3C2212] border border-[#EADBCE]'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{prog.ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

        {/* Rodapé da Seção com Banner de Apoio */}
        <div className="mt-12 bg-gradient-to-r from-[#E5A93C]/20 via-[#FAF6F0] to-[#E87722]/20 border border-[#EADBCE] rounded-3xl p-6 sm:p-8 text-center max-w-4xl mx-auto shadow-xs">
          <p className="font-serif-brand text-xl sm:text-2xl font-bold text-[#3C2212]">
            Dúvidas sobre qual formato escolher?
          </p>
          <p className="text-sm text-[#5A4E46] mt-2 max-w-xl mx-auto">
            Me envie uma mensagem no WhatsApp sem compromisso. Vamos conversar sobre sua rotina e encontrar o plano ideal para você.
          </p>
          <div className="mt-4">
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent('Olá, Thaísa! Tenho dúvidas sobre qual consulta escolher.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#E87722] hover:text-[#D26414] underline decoration-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Tirar dúvidas pelo WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
