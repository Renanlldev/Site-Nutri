'use client';

import React, { useState } from 'react';
import { 
  MessageCircle, 
  Mail, 
  MapPin, 
  CreditCard, 
  ExternalLink, 
  Copy, 
  Check, 
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import InstagramIcon from '@/components/icons/InstagramIcon';
import { SiteSettings } from '@/lib/types';
import { createContactLead } from '@/lib/leads-service';

interface ContactSectionProps {
  settings: SiteSettings;
}

export default function ContactSection({ settings }: ContactSectionProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Estados do formulário de contato / lead
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState<'presencial' | 'online' | 'acompanhamento' | 'duvida'>('presencial');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const primaryWhatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(settings.whatsapp_message)}`;
  const secondaryWhatsappUrl = settings.whatsapp_secondary_number
    ? `https://wa.me/${settings.whatsapp_secondary_number}?text=${encodeURIComponent(settings.whatsapp_message)}`
    : null;

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'R. Viúva Dantas, 214, Campo Grande, Rio de Janeiro - RJ'
  )}`;

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
      await createContactLead({
        name,
        phone,
        email,
        service_type: serviceType,
        message,
      });
      setSubmitSuccess(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#E87722] uppercase">
            Fale Comigo
          </span>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C2212] mt-2">
            Contatos & Localização
          </h2>
          <p className="text-[#5A4E46] text-base sm:text-lg mt-3">
            Tire dúvidas, consulte horários disponíveis ou venha tomar um café em nosso consultório em Campo Grande (RJ).
          </p>
          <div className="w-16 h-1 bg-[#E5A93C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Grade de Contatos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16">
          
          {/* Card WhatsApp (Principal) */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border-2 border-[#25D366]/40 shadow-md hover-lift flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#1EBE5D] flex items-center justify-center mb-5">
                <MessageCircle className="w-6 h-6" />
              </div>
              <h3 className="font-serif-brand text-2xl font-bold text-[#3C2212] mb-1">
                WhatsApp
              </h3>
              <p className="text-xs text-[#706760] mb-4">
                Atendimento rápido para dúvidas e agendamentos.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
                  <span className="text-xs sm:text-sm font-semibold text-[#3C2212]">
                    (21) 98356-2064 (Principal)
                  </span>
                  <button
                    onClick={() => copyToClipboard('(21) 98356-2064', 'wp1')}
                    className="p-1.5 text-[#706760] hover:text-[#3C2212] rounded-md transition-colors"
                    title="Copiar número"
                  >
                    {copiedKey === 'wp1' ? <Check className="w-4 h-4 text-[#5A8D56]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {settings.whatsapp_secondary_number && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
                    <span className="text-xs sm:text-sm font-semibold text-[#3C2212]">
                      (21) 99720-1128 (Secundário)
                    </span>
                    <button
                      onClick={() => copyToClipboard('(21) 99720-1128', 'wp2')}
                      className="p-1.5 text-[#706760] hover:text-[#3C2212] rounded-md transition-colors"
                      title="Copiar número"
                    >
                      {copiedKey === 'wp2' ? <Check className="w-4 h-4 text-[#5A8D56]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={primaryWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BA5A] text-white py-3 rounded-xl text-sm font-bold shadow-xs transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Conversar no WhatsApp</span>
              </a>

              {secondaryWhatsappUrl && (
                <a
                  href={secondaryWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#3C2212] border border-[#EADBCE] py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  <span>Chamar no 2º WhatsApp</span>
                </a>
              )}
            </div>
          </div>

          {/* Card Instagram & E-mail */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm hover-lift flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E87722]/15 text-[#E87722] flex items-center justify-center mb-5">
                <InstagramIcon className="w-6 h-6" />
              </div>
              <h3 className="font-serif-brand text-2xl font-bold text-[#3C2212] mb-1">
                Redes & E-mail
              </h3>
              <p className="text-xs text-[#706760] mb-4">
                Dicas diárias, receitas e contato formal.
              </p>
              
              <div className="space-y-3 mb-6">
                {/* Instagram */}
                <a
                  href={`https://instagram.com/${settings.instagram_handle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE1] border border-[#EADBCE] transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                    <span className="text-xs sm:text-sm font-semibold text-[#3C2212]">
                      @{settings.instagram_handle}
                    </span>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[#706760]" />
                </a>

                {/* Email */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF6F0] border border-[#EADBCE]">
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <Mail className="w-4 h-4 text-[#E87722] shrink-0" />
                    <span className="text-xs sm:text-sm font-semibold text-[#3C2212] truncate">
                      {settings.email}
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(settings.email, 'email')}
                    className="p-1.5 text-[#706760] hover:text-[#3C2212] rounded-md transition-colors shrink-0"
                    title="Copiar e-mail"
                  >
                    {copiedKey === 'email' ? <Check className="w-4 h-4 text-[#5A8D56]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <a
              href={`https://instagram.com/${settings.instagram_handle}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#3C2212] border border-[#EADBCE] py-3 rounded-xl text-sm font-bold transition-colors"
            >
              <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
              <span>Seguir no Instagram</span>
            </a>
          </div>

          {/* Card Endereço & Pagamento */}
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm hover-lift flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#E5A93C]/20 text-[#A87216] flex items-center justify-center mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-serif-brand text-2xl font-bold text-[#3C2212] mb-1">
                Consultório
              </h3>
              <p className="text-xs text-[#706760] mb-4">
                Localização privilegiada e fácil acesso.
              </p>

              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-xl bg-[#FAF6F0] border border-[#EADBCE] text-xs sm:text-sm text-[#4A3E38] leading-relaxed">
                  <p className="font-semibold text-[#3C2212] mb-0.5">Endereço:</p>
                  <p>{settings.address}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#FAF6F0] border border-[#EADBCE] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#5A8D56]" />
                    <span className="text-xs font-semibold text-[#3C2212]">
                      Formas de pagamento:
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#E87722] bg-[#E87722]/10 px-2.5 py-1 rounded-md">
                    {settings.payment_methods || 'Pix ou Dinheiro'}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#FAF6F0] hover:bg-[#F2ECE1] text-[#3C2212] border border-[#EADBCE] py-3 rounded-xl text-sm font-bold transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#E87722]" />
              <span>Ver Rotas no Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#706760]" />
            </a>
          </div>

        </div>

        {/* Formulário Interativo de Solicitação / Pré-Agendamento (Salva no Supabase) */}
        <div className="max-w-3xl mx-auto bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 border border-[#EADBCE] shadow-sm">
          <div className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E87722]/10 text-[#E87722] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Pré-Agendamento Rápido</span>
            </span>
            <h3 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#3C2212]">
              Solicitar Contato com a Nutricionista
            </h3>
            <p className="text-xs sm:text-sm text-[#706760] mt-1 max-w-lg mx-auto">
              Preencha seus dados abaixo. Responderemos com as informações sobre horários disponíveis e valores.
            </p>
          </div>

          {submitSuccess ? (
            <div className="p-6 rounded-2xl bg-green-50 border border-green-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
              <h4 className="font-serif-brand text-xl font-bold text-green-900">
                Mensagem enviada com sucesso!
              </h4>
              <p className="text-xs sm:text-sm text-green-800 max-w-md mx-auto">
                Obrigado pelo contato! Seus dados foram recebidos com segurança e a Thaísa entrará em contato com você via WhatsApp em breve.
              </p>
              <button
                type="button"
                onClick={() => setSubmitSuccess(false)}
                className="mt-2 text-xs font-bold text-green-900 underline hover:no-underline"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Maria da Silva"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Seu WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(21) 99999-9999"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seuemail@exemplo.com"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Modalidade de Interesse
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value as 'presencial' | 'online' | 'acompanhamento' | 'duvida')}
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-medium focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  >
                    <option value="presencial">Atendimento Presencial (Campo Grande - RJ)</option>
                    <option value="online">Atendimento Online (Vídeo)</option>
                    <option value="acompanhamento">Acompanhamento Contínuo / Pacote</option>
                    <option value="duvida">Tirar Dúvidas Gerais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                  Como a Thaísa pode te ajudar? (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Conte um pouco sobre seus objetivos (emagrecimento, reeducação alimentar, saúde feminina, etc.)..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#E87722] hover:bg-[#D26414] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Enviando dados...' : 'Enviar Solicitação de Contato'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
