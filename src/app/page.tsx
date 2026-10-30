'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ProgramsSection from '@/components/ProgramsSection';
import ImcCalculator from '@/components/ImcCalculator';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';
import BackgroundWrapper from '@/components/BackgroundWrapper';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from '@/lib/types';
import { getSiteSettings } from '@/lib/site-settings-service';

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  useEffect(() => {
    async function load() {
      try {
        const loadedSettings = await getSiteSettings();
        setSettings(loadedSettings);
      } catch (e) {
        console.error('Erro ao carregar configurações:', e);
      }
    }
    load();
  }, []);

  return (
    <BackgroundWrapper settings={settings}>
      {/* Header Fixo */}
      <Header settings={settings} />

      <main className="flex-1">
        {/* Seção Hero com Slogan Oficial e Foto */}
        <HeroSection settings={settings} />

        {/* Seção Quem Sou Eu com Bio Editável */}
        <AboutSection settings={settings} />

        {/* Modalidades de Consulta: Presencial e Online */}
        <ProgramsSection settings={settings} />

        {/* Calculadora Interativa de IMC */}
        <ImcCalculator settings={settings} />

        {/* Seção de Contatos, Localização e Formas de Pagamento */}
        <ContactSection settings={settings} />
      </main>

      {/* Rodapé Institucional */}
      <Footer settings={settings} />

      {/* Botão Flutuante do WhatsApp */}
      <FloatingWhatsApp settings={settings} />
    </BackgroundWrapper>
  );
}
