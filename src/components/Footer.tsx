'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MessageCircle, MapPin, Lock, Heart } from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { SiteSettings } from '@/lib/types';

interface FooterProps {
  settings: SiteSettings;
}

export default function Footer({ settings }: FooterProps) {
  const currentYear = 2026;

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  return (
    <footer className="bg-[#2D1B0F] text-[#FAF6F0] pt-16 pb-12 border-t border-[#4A2E18]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#4A2E18]/80">
          
          {/* Coluna 1: Marca & Filosofia */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#E5A93C] bg-[#FFFDF9]">
                <Image
                  src="/images/logo.jpeg"
                  alt="Thaísa Felix Nutricionista"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-serif-brand text-2xl font-bold tracking-wider text-white">
                  Thaísa Felix
                </span>
                <span className="block text-[11px] tracking-[0.25em] text-[#E5A93C] font-semibold uppercase">
                  Nutricionista
                </span>
              </div>
            </div>

            <p className="text-sm text-[#D4C4B4] leading-relaxed max-w-sm">
              Aqui a transformação acontece com saúde, constância e zero paranoia. Atendimento presencial em Campo Grande (RJ) e online para todo o Brasil.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3C2212] hover:bg-[#25D366] text-[#FAF6F0] hover:text-white flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={`https://instagram.com/${settings.instagram_handle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#3C2212] hover:bg-[#E1306C] text-[#FAF6F0] hover:text-white flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="w-10 h-10 rounded-full bg-[#3C2212] hover:bg-[#E87722] text-[#FAF6F0] hover:text-white flex items-center justify-center transition-colors"
                aria-label="E-mail"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Coluna 2: Links Rápidos */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-brand text-lg font-bold text-[#E5A93C] mb-2">
              Navegação
            </h4>
            <ul className="space-y-2 text-sm text-[#D4C4B4]">
              <li>
                <a href="#hero" className="hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#sobre" className="hover:text-white transition-colors">
                  Quem Sou Eu
                </a>
              </li>
              <li>
                <a href="#programas" className="hover:text-white transition-colors">
                  Modalidades de Consulta
                </a>
              </li>
              <li>
                <a href="#imc" className="hover:text-white transition-colors">
                  Calculadora de IMC
                </a>
              </li>
              <li>
                <a href="#contato" className="hover:text-white transition-colors">
                  Contatos & Endereço
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Localização & Atendimento */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-serif-brand text-lg font-bold text-[#E5A93C] mb-2">
              Consultório Físico
            </h4>
            <div className="flex items-start gap-2.5 text-sm text-[#D4C4B4] leading-relaxed">
              <MapPin className="w-5 h-5 text-[#E87722] shrink-0 mt-0.5" />
              <span>{settings.address}</span>
            </div>
            <p className="text-xs text-[#A89E96] pt-1">
              Atendimento com hora marcada. Aceitamos pagamentos em Pix e dinheiro.
            </p>

            <div className="pt-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 text-xs text-[#E5A93C]/80 hover:text-[#E5A93C] transition-colors bg-[#3C2212] px-3 py-1.5 rounded-lg border border-[#4A2E18]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Acesso Administrativo (Painel)</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Linha de Direitos & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#A89E96] gap-4 text-center sm:text-left">
          <p>
            &copy; {currentYear} Thaísa Felix Nutricionista. Todos os direitos reservados.
          </p>
          <p className="flex items-center justify-center gap-1">
            Feito com <Heart className="w-3 h-3 text-[#E87722] fill-current" /> para transformar vidas.
          </p>
        </div>

      </div>
    </footer>
  );
}
