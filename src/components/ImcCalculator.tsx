'use client';

import React, { useState } from 'react';
import { Calculator, Sparkles, CheckCircle, MessageCircle, RefreshCw } from 'lucide-react';
import { SiteSettings } from '@/lib/types';

interface ImcCalculatorProps {
  settings: SiteSettings;
}

export default function ImcCalculator({ settings }: ImcCalculatorProps) {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [gender, setGender] = useState<'female' | 'male'>('female');
  const [result, setResult] = useState<{
    imc: number;
    category: string;
    description: string;
    color: string;
    badgeBg: string;
    badgeText: string;
  } | null>(null);

  const calculateIMC = (e: React.FormEvent) => {
    e.preventDefault();

    const w = parseFloat(weight.replace(',', '.'));
    let h = parseFloat(height.replace(',', '.'));

    if (!w || !h || w <= 0 || h <= 0) return;

    // Converter para metros se o usuário digitou em centímetros (ex: 165 -> 1.65)
    if (h > 3) {
      h = h / 100;
    }

    const imc = parseFloat((w / (h * h)).toFixed(1));

    let category = '';
    let description = '';
    let color = '';
    let badgeBg = '';
    let badgeText = '';

    if (imc < 18.5) {
      category = 'Abaixo do peso recomendado';
      description =
        'Seu índice está abaixo do padrão. Pode indicar necessidade de adequação calórica e proteica para evitar carências nutricionais e fadiga.';
      color = '#3B82F6';
      badgeBg = 'bg-blue-100';
      badgeText = 'text-blue-800';
    } else if (imc >= 18.5 && imc <= 24.9) {
      category = 'Peso saudável (Eutrofia)';
      description =
        'Excelente! Seu peso está dentro da faixa esperada pela OMS. O foco agora é manter a constância, disposição e nutrientes em dia.';
      color = '#5A8D56';
      badgeBg = 'bg-green-100';
      badgeText = 'text-green-800';
    } else if (imc >= 25 && imc <= 29.9) {
      category = 'Sobrepeso leve';
      description =
        'Um momento perfeito para reorganizar a rotina sem dietas malucas. Lembre-se: massa muscular pesa mais que gordura, então uma avaliação em consulta é fundamental!';
      color = '#E5A93C';
      badgeBg = 'bg-amber-100';
      badgeText = 'text-amber-800';
    } else if (imc >= 30 && imc <= 34.9) {
      category = 'Obesidade Grau I';
      description =
        'Com acolhimento e estratégia, é possível reverter esse quadro com muita saúde e sem sofrimento. Pequenos passos já trazem grandes benefícios cardiovasculares.';
      color = '#E87722';
      badgeBg = 'bg-orange-100';
      badgeText = 'text-orange-800';
    } else {
      category = 'Obesidade Grau II / III';
      description =
        'Cuidar de você deve ser a prioridade. Vamos juntos criar um plano seguro, gradual e focado em longevidade e bem-estar integral.';
      color = '#DC2626';
      badgeBg = 'bg-red-100';
      badgeText = 'text-red-800';
    }

    setResult({
      imc,
      category,
      description,
      color,
      badgeBg,
      badgeText,
    });
  };

  const handleReset = () => {
    setWeight('');
    setHeight('');
    setResult(null);
  };

  const whatsappConsultationUrl = result
    ? `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
        `Olá, Thaísa! Calculei meu IMC no site (resultado: ${result.imc} - ${result.category}) e gostaria de agendar uma consulta para fazer uma avaliação corporal completa!`
      )}`
    : `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(
        `Olá, Thaísa! Gostaria de agendar uma consulta para avaliação corporal completa.`
      )}`;

  return (
    <section id="imc" className="py-20 sm:py-28 bg-[#FAF6F0]/90 relative border-t border-[#EADBCE]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-widest text-[#E87722] uppercase">
            Ferramenta Interativa Gratuita
          </span>
          <h2 className="font-serif-brand text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3C2212] mt-2">
            Calculadora de IMC
          </h2>
          <p className="text-[#5A4E46] text-sm sm:text-base mt-3">
            Descubra uma estimativa inicial da sua faixa de peso e entenda o que isso significa na prática, com orientação responsável e sem paranoia.
          </p>
          <div className="w-16 h-1 bg-[#E5A93C] mx-auto mt-4 rounded-full" />
        </div>

        {/* Caixa Principal */}
        <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EADBCE] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Formulário */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-[#E87722]" />
              <h3 className="font-serif-brand text-xl font-bold text-[#3C2212]">
                Seus Dados
              </h3>
            </div>

            <form onSubmit={calculateIMC} className="space-y-4">
              
              {/* Seleção de Gênero */}
              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1.5 uppercase tracking-wider">
                  Gênero
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      gender === 'female'
                        ? 'bg-[#E87722] text-white border-[#E87722] shadow-xs'
                        : 'bg-[#FAF6F0] text-[#706760] border-[#EADBCE] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    Feminino
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                      gender === 'male'
                        ? 'bg-[#E87722] text-white border-[#E87722] shadow-xs'
                        : 'bg-[#FAF6F0] text-[#706760] border-[#EADBCE] hover:bg-[#F2ECE1]'
                    }`}
                  >
                    Masculino
                  </button>
                </div>
              </div>

              {/* Input Peso */}
              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1.5 uppercase tracking-wider">
                  Peso (kg)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 68.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-base text-[#3C2212] font-semibold placeholder:text-[#A89E96] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#706760] font-bold">
                    kg
                  </span>
                </div>
              </div>

              {/* Input Altura */}
              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1.5 uppercase tracking-wider">
                  Altura (cm ou metros)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="Ex: 168 ou 1.68"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-base text-[#3C2212] font-semibold placeholder:text-[#A89E96] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                  <span className="absolute right-4 top-3.5 text-xs text-[#706760] font-bold">
                    cm / m
                  </span>
                </div>
              </div>

              {/* Botões do Formulário */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E87722] hover:bg-[#D26414] text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-md transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Calcular Meu IMC
                </button>
                
                {result && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="p-3.5 rounded-xl border border-[#EADBCE] text-[#706760] hover:bg-[#FAF6F0] hover:text-[#3C2212] transition-colors"
                    title="Limpar cálculo"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Resultado / Área de Visualização */}
          <div className="lg:col-span-6 bg-[#FAF6F0] rounded-2xl p-6 border border-[#EADBCE] flex flex-col justify-between min-h-[320px]">
            {result ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#706760]">
                    Seu Resultado
                  </span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${result.badgeBg} ${result.badgeText}`}>
                    {result.category}
                  </span>
                </div>

                {/* Número do IMC */}
                <div className="flex items-baseline gap-2">
                  <span className="font-serif-brand text-5xl sm:text-6xl font-bold text-[#3C2212]">
                    {result.imc}
                  </span>
                  <span className="text-sm font-semibold text-[#706760]">
                    kg/m²
                  </span>
                </div>

                {/* Descrição acolhedora */}
                <p className="text-xs sm:text-sm text-[#4A3E38] leading-relaxed bg-[#FFFDF9] p-3.5 rounded-xl border border-[#EADBCE]">
                  {result.description}
                </p>

                {/* Alerta Zero Paranoia */}
                <div className="flex items-start gap-2 bg-[#E5A93C]/15 p-3 rounded-xl text-xs text-[#7A5210] border border-[#E5A93C]/30">
                  <Sparkles className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <span>
                    <strong>Importante:</strong> O IMC não avalia sua composição corporal (massa magra vs gordura). Para um plano sob medida, avalie seu caso individualmente.
                  </span>
                </div>

                {/* Botão de Agendamento com o IMC pré-preenchido */}
                <a
                  href={whatsappConsultationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#5A8D56] hover:bg-[#4E7A4A] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Fazer Avaliação Completa com a Thaísa</span>
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center h-full py-8 text-[#706760] space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#EADBCE]/50 flex items-center justify-center text-[#E87722]">
                  <Calculator className="w-8 h-8" />
                </div>
                <h4 className="font-serif-brand text-xl font-bold text-[#3C2212]">
                  Aguardando seus dados
                </h4>
                <p className="text-xs max-w-xs leading-relaxed text-[#5A4E46]">
                  Preencha seu peso e altura ao lado para ver sua estimativa e receber orientações reais de saúde.
                </p>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-[#5A8D56] font-semibold bg-[#5A8D56]/10 px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Abordagem 100% humanizada</span>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
