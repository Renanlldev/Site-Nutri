'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, MessageCircle, Lock } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface HeaderProps {
  settings: SiteSettings;
}

export default function Header({ settings }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FAF6F0]/90 backdrop-blur-md shadow-sm py-3 border-b border-[#EADBCE]/60'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo & Nome da Marca */}
          <Link href="#hero" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#E5A93C]/40 bg-[#FFFDF9] shadow-xs transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.jpeg"
                alt="Logo Thaísa Felix Nutricionista"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif-brand text-xl sm:text-2xl font-bold tracking-wider text-[#3C2212] group-hover:text-[#E87722] transition-colors">
                Thaísa Felix
              </span>
              <span className="text-[10px] sm:text-xs tracking-[0.25em] text-[#706760] font-medium uppercase -mt-1">
                Nutricionista
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#hero"
              className="text-sm font-medium text-[#4A3E38] hover:text-[#E87722] transition-colors"
            >
              Início
            </a>
            <a
              href="#sobre"
              className="text-sm font-medium text-[#4A3E38] hover:text-[#E87722] transition-colors"
            >
              Quem Sou Eu
            </a>
            <a
              href="#programas"
              className="text-sm font-medium text-[#4A3E38] hover:text-[#E87722] transition-colors"
            >
              Atendimentos
            </a>
            <a
              href="#imc"
              className="text-sm font-medium text-[#4A3E38] hover:text-[#E87722] transition-colors flex items-center gap-1.5"
            >
              Calculadora IMC
              <span className="text-[10px] bg-[#E87722]/15 text-[#E87722] font-semibold px-1.5 py-0.5 rounded-full">
                Grátis
              </span>
            </a>
            <a
              href="#contato"
              className="text-sm font-medium text-[#4A3E38] hover:text-[#E87722] transition-colors"
            >
              Contato
            </a>
          </nav>

          {/* Ações (WhatsApp CTA & Acesso Admin) */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E87722] hover:bg-[#D26414] text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Agendar Consulta</span>
            </a>

            <Link
              href="/admin"
              title="Área Administrativa"
              className="p-2 text-[#706760] hover:text-[#3C2212] hover:bg-[#EADBCE]/40 rounded-full transition-colors"
            >
              <Lock className="w-4 h-4" />
            </Link>
          </div>

          {/* Botão Menu Mobile */}
          <div className="flex md:hidden items-center gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-[#E87722] text-white rounded-full shadow-xs"
              aria-label="Agendar via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#3C2212] hover:bg-[#EADBCE]/50 focus:outline-hidden"
              aria-label="Abrir Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF6F0] border-b border-[#EADBCE] px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            <a
              href="#hero"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-[#3C2212] hover:bg-[#EADBCE]/50"
            >
              Início
            </a>
            <a
              href="#sobre"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-[#3C2212] hover:bg-[#EADBCE]/50"
            >
              Quem Sou Eu
            </a>
            <a
              href="#programas"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-[#3C2212] hover:bg-[#EADBCE]/50"
            >
              Atendimentos (Presencial & Online)
            </a>
            <a
              href="#imc"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-[#3C2212] hover:bg-[#EADBCE]/50 flex items-center justify-between"
            >
              <span>Calculadora de IMC</span>
              <span className="text-xs bg-[#E87722]/15 text-[#E87722] font-semibold px-2 py-0.5 rounded-full">
                Interativa
              </span>
            </a>
            <a
              href="#contato"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-[#3C2212] hover:bg-[#EADBCE]/50"
            >
              Contatos & Localização
            </a>

            <div className="pt-2 border-t border-[#EADBCE] flex flex-col gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[#E87722] text-white py-3 rounded-full text-base font-semibold shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Conversar no WhatsApp</span>
              </a>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 text-xs text-[#706760] py-2 hover:text-[#3C2212]"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Área do Administrador</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
