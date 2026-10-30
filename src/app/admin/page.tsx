'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock, 
  User, 
  KeyRound, 
  Save, 
  ArrowLeft, 
  Image as ImageIcon, 
  FileText, 
  Phone, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Sparkles,
  ExternalLink,
  Palette,
  Upload,
  RefreshCw,
  Trash2,
  Inbox,
  Database,
  Check
} from 'lucide-react';
import { SiteSettings, DEFAULT_SITE_SETTINGS, ContactLead } from '@/lib/types';
import { getSiteSettings, saveSiteSettings } from '@/lib/site-settings-service';
import { supabase, isSupabaseConfigured, testSupabaseConnection } from '@/lib/supabase';
import { uploadSiteAsset } from '@/lib/storage-service';
import { getContactLeads, updateContactLeadStatus, deleteContactLead } from '@/lib/leads-service';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);

  // Estados das Configurações
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [activeTab, setActiveTab] = useState<'bio' | 'background' | 'contact' | 'leads'>('bio');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados de Upload de Imagem (Supabase Storage)
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Estados dos Leads / Agendamentos
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

  // Estados do Diagnóstico de Conexão Supabase
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    ok: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  // Verificar se o usuário já tem sessão no Supabase ou local
  useEffect(() => {
    async function checkSession() {
      if (isSupabaseConfigured && supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setIsAuthenticated(true);
        }
      } else {
        // Modo local de desenvolvimento
        const localAuth = sessionStorage.getItem('thaisa_admin_auth');
        if (localAuth === 'true') {
          setIsAuthenticated(true);
        }
      }

      const currentSettings = await getSiteSettings();
      setSettings(currentSettings);
    }

    checkSession();
  }, []);

  const loadLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const data = await getContactLeads();
      setLeads(data);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Carregar leads quando a aba de leads for selecionada
  useEffect(() => {
    let ignore = false;
    if (activeTab === 'leads' && isAuthenticated) {
      getContactLeads().then((data) => {
        if (!ignore) {
          setLeads(data);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [activeTab, isAuthenticated]);

  const handleUpdateLeadStatus = async (id: string, status: ContactLead['status']) => {
    await updateContactLeadStatus(id, status);
    loadLeads();
  };

  const handleDeleteLead = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro de contato?')) {
      await deleteContactLead(id);
      loadLeads();
    }
  };

  // Testar Conexão com Supabase
  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const result = await testSupabaseConnection();
      setConnectionStatus({
        tested: true,
        ok: result.ok,
        message: result.message,
        latencyMs: result.latencyMs,
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setIsAuthLoading(true);

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Se o usuário ainda não existir no Supabase, tentar registrar como primeiro admin
          if (error.message.includes('Invalid login credentials')) {
            const { error: signUpError } = await supabase.auth.signUp({
              email,
              password,
            });
            if (!signUpError) {
              setSaveMessage({
                type: 'success',
                text: 'Conta de administradora criada e conectada com sucesso no Supabase!',
              });
              setIsAuthenticated(true);
              setIsAuthLoading(false);
              return;
            }
          }
          throw error;
        }

        if (data.user) {
          setIsAuthenticated(true);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setAuthError(errorMsg || 'Erro ao autenticar no Supabase.');
      } finally {
        setIsAuthLoading(false);
      }
    } else {
      // Modo local / demonstração (senha padrão: thaisa123 ou qualquer senha preenchida)
      if (password === 'thaisa123' || password === 'admin' || password.length >= 6) {
        sessionStorage.setItem('thaisa_admin_auth', 'true');
        setIsAuthenticated(true);
        setIsAuthLoading(false);
      } else {
        setAuthError('Senha de demonstração: digite "thaisa123" ou qualquer senha com pelo menos 6 dígitos.');
        setIsAuthLoading(false);
      }
    }
  };

  // Logout
  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('thaisa_admin_auth');
    setIsAuthenticated(false);
  };

  // Salvar Configurações
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const result = await saveSiteSettings(settings);
      setSaveMessage({
        type: 'success',
        text: result.message,
      });
      setTimeout(() => setSaveMessage(null), 4000);
    } catch {
      setSaveMessage({
        type: 'error',
        text: 'Erro ao salvar configurações.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Upload de Imagem de Fundo para o Supabase Storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const result = await uploadSiteAsset(file, 'backgrounds');
      if (result.success && result.url) {
        setSettings({
          ...settings,
          background_theme: 'custom_image',
          custom_bg_url: result.url,
        });
        setUploadMessage({
          type: 'success',
          text: 'Imagem enviada com sucesso para o Supabase Storage CDN!',
        });
      } else {
        setUploadMessage({
          type: 'error',
          text: result.error || 'Falha no upload da imagem.',
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setUploadMessage({
        type: 'error',
        text: `Erro ao enviar arquivo: ${errorMsg}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // TELA DE LOGIN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#FFFDF9] rounded-3xl p-8 border border-[#EADBCE] shadow-xl">
          
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#E5A93C] bg-white shadow-xs">
              <Image
                src="/images/logo.jpeg"
                alt="Thaísa Felix Nutricionista"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-serif-brand text-2xl font-bold text-[#3C2212]">
              Painel Administrativo
            </h1>
            <p className="text-xs text-[#706760] mt-1">
              Gerencie a Bio, o WhatsApp, Imagens e Leads do site
            </p>
          </div>

          {!isSupabaseConfigured ? (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-xs text-[#7A5210] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#E87722] shrink-0 mt-0.5" />
              <div>
                <strong>Modo Local / Demonstração Ativo:</strong>
                <p className="mt-0.5">
                  Você pode entrar digitando o e-mail da Thaísa e a senha <code>thaisa123</code>. Para conectar seu Supabase em nuvem, adicione a <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> no arquivo <code>.env.local</code>.
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#5A8D56]/15 border border-[#5A8D56]/30 text-xs text-[#285724] flex items-start gap-2.5">
              <Database className="w-4 h-4 text-[#5A8D56] shrink-0 mt-0.5" />
              <div>
                <strong>Supabase Configurado:</strong>
                <p className="mt-0.5">
                  Faça login com seu e-mail e senha de administrador cadastrados no Supabase Auth.
                </p>
              </div>
            </div>
          )}

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-100 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                E-mail
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nutrithaisafelix@gmail.com"
                  required
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-medium placeholder:text-[#A89E96] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
                <User className="absolute right-3.5 top-3.5 w-4 h-4 text-[#A89E96]" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-medium placeholder:text-[#A89E96] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
                <KeyRound className="absolute right-3.5 top-3.5 w-4 h-4 text-[#A89E96]" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthLoading}
              className="w-full bg-[#E87722] hover:bg-[#D26414] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{isAuthLoading ? 'Entrando...' : 'Entrar no Painel'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EADBCE] text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#706760] hover:text-[#3C2212]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Voltar ao site público</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // TELA DO PAINEL PRINCIPAL
  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3C2212]">
      
      {/* Header do Painel */}
      <header className="bg-[#FFFDF9] border-b border-[#EADBCE] sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-[#E5A93C]">
              <Image
                src="/images/logo.jpeg"
                alt="Thaísa Felix"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="font-serif-brand text-lg font-bold text-[#3C2212] leading-tight block">
                Painel da Nutricionista
              </span>
              <span className={`text-[10px] font-semibold flex items-center gap-1 ${
                isSupabaseConfigured ? 'text-[#5A8D56]' : 'text-[#A87216]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  isSupabaseConfigured ? 'bg-[#5A8D56]' : 'bg-[#E5A93C]'
                }`} />
                {isSupabaseConfigured ? 'Conectado ao Supabase (Cloud)' : 'Modo Armazenamento Local (Offline)'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleTestConnection}
              disabled={isTestingConnection}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCE] bg-[#FAF6F0] hover:bg-[#F2ECE1] text-xs font-semibold text-[#706760] transition-colors"
              title="Testar conexão com o banco de dados Supabase"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingConnection ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">Testar Supabase</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#EADBCE] text-xs font-semibold text-[#706760] hover:bg-[#FAF6F0] hover:text-[#3C2212] transition-colors"
            >
              <span>Ver Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold transition-colors"
              title="Sair do painel"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {/* Banner de Diagnóstico do Supabase */}
        {connectionStatus && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-start justify-between gap-3 text-sm font-semibold shadow-xs animate-in fade-in duration-200 ${
              connectionStatus.ok
                ? 'bg-green-50 text-green-900 border border-green-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200'
            }`}
          >
            <div className="flex items-start gap-2.5">
              {connectionStatus.ok ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <p>{connectionStatus.message}</p>
                {connectionStatus.latencyMs !== undefined && (
                  <p className="text-xs font-normal text-green-700 mt-0.5">
                    Tempo de resposta: {connectionStatus.latencyMs}ms
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setConnectionStatus(null)}
              className="text-xs opacity-60 hover:opacity-100 text-current"
            >
              Fechar
            </button>
          </div>
        )}

        {/* Banner de Feedback de Salvamento */}
        {saveMessage && (
          <div
            className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-semibold shadow-xs animate-in fade-in duration-200 ${
              saveMessage.type === 'success'
                ? 'bg-green-100 text-green-900 border border-green-200'
                : 'bg-red-100 text-red-900 border border-red-200'
            }`}
          >
            {saveMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{saveMessage.text}</span>
          </div>
        )}

        {/* Navegação por Abas */}
        <div className="flex items-center gap-2 border-b border-[#EADBCE] pb-3 overflow-x-auto mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('bio')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'bio'
                ? 'bg-[#E87722] text-white shadow-xs'
                : 'text-[#706760] hover:bg-[#FFFDF9] hover:text-[#3C2212]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Editar Bio (Quem Sou Eu)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('background')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'background'
                ? 'bg-[#E87722] text-white shadow-xs'
                : 'text-[#706760] hover:bg-[#FFFDF9] hover:text-[#3C2212]'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>2. Mudar Plano de Fundo & Mídia</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('contact')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'contact'
                ? 'bg-[#E87722] text-white shadow-xs'
                : 'text-[#706760] hover:bg-[#FFFDF9] hover:text-[#3C2212]'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span>3. WhatsApp & Contatos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === 'leads'
                ? 'bg-[#E87722] text-white shadow-xs'
                : 'text-[#706760] hover:bg-[#FFFDF9] hover:text-[#3C2212]'
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>4. Leads & Agendamentos</span>
            {leads.filter((l) => l.status === 'novo').length > 0 && (
              <span className="bg-[#D9383A] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {leads.filter((l) => l.status === 'novo').length}
              </span>
            )}
          </button>
        </div>

        {/* CONTEÚDO DAS ABAS */}

        {/* ABA 1: EDITAR BIO */}
        {activeTab === 'bio' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm space-y-6">
              <div>
                <h2 className="font-serif-brand text-2xl font-bold text-[#3C2212]">
                  Editar Apresentação & Biografia
                </h2>
                <p className="text-xs sm:text-sm text-[#706760] mt-1">
                  Este texto aparece na seção &quot;Quem Sou Eu&quot; da página inicial.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1.5 uppercase tracking-wider">
                  Título da Seção
                </label>
                <input
                  type="text"
                  value={settings.bio_title}
                  onChange={(e) => setSettings({ ...settings, bio_title: e.target.value })}
                  placeholder="Ex: Olá, sou a Thaísa Felix"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#706760] uppercase tracking-wider">
                    Conteúdo da Bio (Separe parágrafos com duas quebras de linha)
                  </label>
                  <span className="text-[11px] text-[#706760]">
                    {settings.bio_content.length} caracteres
                  </span>
                </div>
                <textarea
                  rows={8}
                  value={settings.bio_content}
                  onChange={(e) => setSettings({ ...settings, bio_content: e.target.value })}
                  placeholder="Escreva sua história, formação e filosofia de atendimento..."
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-[#E87722] hover:bg-[#D26414] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ABA 2: MUDAR PLANO DE FUNDO & MÍDIA (COM SUPABASE STORAGE) */}
        {activeTab === 'background' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm space-y-6">
              <div>
                <h2 className="font-serif-brand text-2xl font-bold text-[#3C2212]">
                  Escolher Plano de Fundo & Armazenamento Supabase
                </h2>
                <p className="text-xs sm:text-sm text-[#706760] mt-1">
                  Selecione um tema pré-definido ou faça upload de uma foto própria direto para o Supabase Storage.
                </p>
              </div>

              {/* Grid de Estilos */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Opção 1: Frutas e Ondas Orgânicas (Padrão) */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, background_theme: 'organic_fruits' })}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    settings.background_theme === 'organic_fruits'
                      ? 'border-[#E87722] bg-[#FAF6F0] shadow-md ring-2 ring-[#E87722]/30'
                      : 'border-[#EADBCE] bg-[#FFFDF9] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="h-20 w-full rounded-xl bg-gradient-to-br from-[#E87722]/20 via-[#FAF6F0] to-[#5A8D56]/20 border border-[#EADBCE] mb-3 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-[#E87722]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#3C2212]">Frutas & Ondas</h3>
                  <p className="text-xs text-[#706760] mt-0.5">
                    Original das artes da marca, com curvas orgânicas e tons acolhedores.
                  </p>
                </button>

                {/* Opção 2: Ondas Quentes */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, background_theme: 'warm_waves' })}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    settings.background_theme === 'warm_waves'
                      ? 'border-[#E87722] bg-[#FAF6F0] shadow-md ring-2 ring-[#E87722]/30'
                      : 'border-[#EADBCE] bg-[#FFFDF9] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="h-20 w-full rounded-xl bg-gradient-to-tr from-[#F5E9DA] to-[#FAF4EB] border border-[#EADBCE] mb-3 flex items-center justify-center">
                    <Palette className="w-6 h-6 text-[#E5A93C]" />
                  </div>
                  <h3 className="font-bold text-sm text-[#3C2212]">Ondas Quentes</h3>
                  <p className="text-xs text-[#706760] mt-0.5">
                    Tons de areia e creme suave para um visual minimalista e elegante.
                  </p>
                </button>

                {/* Opção 3: Marfim Clean */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, background_theme: 'clean_ivory' })}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    settings.background_theme === 'clean_ivory'
                      ? 'border-[#E87722] bg-[#FAF6F0] shadow-md ring-2 ring-[#E87722]/30'
                      : 'border-[#EADBCE] bg-[#FFFDF9] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="h-20 w-full rounded-xl bg-[#FCFAF6] border border-[#EADBCE] mb-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#706760]">100% Clean</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#3C2212]">Linho / Marfim</h3>
                  <p className="text-xs text-[#706760] mt-0.5">
                    Fundo liso e neutro para máxima leitura e simplicidade.
                  </p>
                </button>

                {/* Opção 4: Verde Sálvia */}
                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, background_theme: 'soft_green' })}
                  className={`text-left p-4 rounded-2xl border-2 transition-all ${
                    settings.background_theme === 'soft_green'
                      ? 'border-[#E87722] bg-[#FAF6F0] shadow-md ring-2 ring-[#E87722]/30'
                      : 'border-[#EADBCE] bg-[#FFFDF9] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="h-20 w-full rounded-xl bg-[#F4F7F3] border border-[#EADBCE] mb-3 flex items-center justify-center">
                    <span className="text-xs font-bold text-[#5A8D56]">Saúde Natural</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#3C2212]">Verde Suave</h3>
                  <p className="text-xs text-[#706760] mt-0.5">
                    Toque de verde bem-estar para reforçar a conexão com a natureza.
                  </p>
                </button>

              </div>

              {/* Upload direto para o Supabase Storage */}
              <div className="pt-6 border-t border-[#EADBCE] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#E87722]" />
                    <span className="font-serif-brand text-lg font-bold text-[#3C2212]">
                      Upload de Imagem para Supabase Storage
                    </span>
                  </div>
                  <span className="text-xs text-[#706760]">
                    Bucket: <code>site-assets</code>
                  </span>
                </div>

                {uploadMessage && (
                  <div
                    className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                      uploadMessage.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {uploadMessage.type === 'success' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span>{uploadMessage.text}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  
                  {/* Dropzone / Upload button */}
                  <label className="border-2 border-dashed border-[#EADBCE] hover:border-[#E87722] bg-[#FAF6F0] rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-[#F5EDE3] group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <Upload className={`w-8 h-8 text-[#A89E96] group-hover:text-[#E87722] mb-2 transition-colors ${
                      isUploading ? 'animate-bounce text-[#E87722]' : ''
                    }`} />
                    <span className="text-xs font-bold text-[#3C2212]">
                      {isUploading ? 'Enviando imagem para a nuvem...' : 'Clique para escolher uma imagem'}
                    </span>
                    <span className="text-[11px] text-[#706760] mt-1">
                      JPG, PNG ou WEBP até 5MB
                    </span>
                  </label>

                  {/* Pré-visualização atual */}
                  <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] space-y-2">
                    <span className="text-xs font-semibold text-[#706760] uppercase tracking-wider block">
                      URL da Imagem Atual:
                    </span>
                    <input
                      type="url"
                      value={settings.custom_bg_url || ''}
                      onChange={(e) => setSettings({ 
                        ...settings, 
                        background_theme: 'custom_image',
                        custom_bg_url: e.target.value 
                      })}
                      placeholder="https://...supabase.co/storage/v1/object/public/site-assets/..."
                      className="w-full bg-white border border-[#EADBCE] rounded-xl px-3 py-2 text-xs text-[#3C2212] font-mono focus:outline-hidden focus:ring-1 focus:ring-[#E87722]"
                    />
                    {settings.custom_bg_url && (
                      <div className="relative h-24 w-full rounded-xl overflow-hidden border border-[#EADBCE]">
                        <Image
                          src={settings.custom_bg_url}
                          alt="Pré-visualização do Fundo"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-[#E87722] hover:bg-[#D26414] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ABA 3: WHATSAPP & CONTATOS */}
        {activeTab === 'contact' && (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm space-y-6">
              <div>
                <h2 className="font-serif-brand text-2xl font-bold text-[#3C2212]">
                  WhatsApp, Redes e Endereço
                </h2>
                <p className="text-xs sm:text-sm text-[#706760] mt-1">
                  Configure o número para onde os botões do site irão direcionar os pacientes.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Número do WhatsApp Principal (com DDI e DDD, apenas números)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="Ex: 5521983562064"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                  <p className="text-[11px] text-[#706760] mt-1">
                    Padrão atual: 55 + 21 + 983562064
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Número do WhatsApp Secundário (opcional)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsapp_secondary_number || ''}
                    onChange={(e) => setSettings({ ...settings, whatsapp_secondary_number: e.target.value })}
                    placeholder="Ex: 5521997201128"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                  <p className="text-[11px] text-[#706760] mt-1">
                    Padrão atual: 55 + 21 + 997201128
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                  Mensagem Automática Inicial do WhatsApp
                </label>
                <input
                  type="text"
                  value={settings.whatsapp_message}
                  onChange={(e) => setSettings({ ...settings, whatsapp_message: e.target.value })}
                  placeholder="Ex: Olá, Thaísa! Gostaria de informações sobre consulta nutricional."
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    Usuário do Instagram (sem @)
                  </label>
                  <input
                    type="text"
                    value={settings.instagram_handle}
                    onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                    placeholder="nutrithaisafelix"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                    E-mail Institucional
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="nutrithaisafelix@gmail.com"
                    className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                  Endereço do Consultório
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="R. Viúva Dantas, 214 - Sala 609, Campo Grande, Rio de Janeiro - RJ"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#706760] mb-1 uppercase tracking-wider">
                  Formas de Pagamento
                </label>
                <input
                  type="text"
                  value={settings.payment_methods}
                  onChange={(e) => setSettings({ ...settings, payment_methods: e.target.value })}
                  placeholder="Pix ou Dinheiro"
                  className="w-full bg-[#FAF6F0] border border-[#EADBCE] rounded-xl px-4 py-3 text-sm text-[#3C2212] focus:outline-hidden focus:ring-2 focus:ring-[#E87722]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-[#E87722] hover:bg-[#D26414] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Salvando...' : 'Salvar Alterações'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ABA 4: LEADS & AGENDAMENTOS RECEBIDOS */}
        {activeTab === 'leads' && (
          <div className="bg-[#FFFDF9] rounded-3xl p-6 sm:p-8 border border-[#EADBCE] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif-brand text-2xl font-bold text-[#3C2212]">
                  Contatos & Pedidos de Agendamento
                </h2>
                <p className="text-xs sm:text-sm text-[#706760] mt-1">
                  Mensagens e solicitações salvas na tabela <code>contact_leads</code> do Supabase.
                </p>
              </div>

              <button
                onClick={loadLeads}
                disabled={isLoadingLeads}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#F2ECE1] border border-[#EADBCE] text-xs font-bold text-[#3C2212] transition-colors self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                <span>Atualizar Lista</span>
              </button>
            </div>

            {leads.length === 0 ? (
              <div className="py-16 text-center text-[#706760] space-y-2">
                <Inbox className="w-12 h-12 text-[#EADBCE] mx-auto" />
                <h3 className="font-serif-brand text-lg font-bold text-[#3C2212]">
                  Nenhum contato registrado ainda
                </h3>
                <p className="text-xs max-w-sm mx-auto">
                  Quando pacientes solicitarem contato ou pré-agendamento pelo site, eles aparecerão organizados aqui.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => {
                  const leadPhoneClean = lead.phone.replace(/\D/g, '');
                  const whatsappLeadUrl = `https://wa.me/55${leadPhoneClean}?text=${encodeURIComponent(
                    `Olá, ${lead.name}! Sou a Thaísa Felix. Recebi seu contato através do site sobre ${lead.service_type || 'consulta'}. Como posso te ajudar?`
                  )}`;

                  return (
                    <div
                      key={lead.id}
                      className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EADBCE] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#E87722]/50 shadow-2xs"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-base text-[#3C2212]">
                            {lead.name}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                            lead.status === 'novo'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : lead.status === 'em_atendimento'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                          }`}>
                            {lead.status === 'novo' ? 'Novo' : lead.status === 'em_atendimento' ? 'Em Atendimento' : 'Concluído'}
                          </span>
                          {lead.service_type && (
                            <span className="text-[10px] font-semibold bg-[#EADBCE]/60 text-[#3C2212] px-2 py-0.5 rounded-md">
                              {lead.service_type}
                            </span>
                          )}
                          {lead.imc && (
                            <span className="text-[10px] font-semibold bg-[#5A8D56]/15 text-[#5A8D56] px-2 py-0.5 rounded-md">
                              IMC: {lead.imc}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-[#706760] flex flex-wrap gap-x-4 gap-y-1">
                          <span>Telefone: <strong>{lead.phone}</strong></span>
                          {lead.email && <span>E-mail: <strong>{lead.email}</strong></span>}
                          {lead.created_at && (
                            <span>Data: {new Date(lead.created_at).toLocaleDateString('pt-BR')} às {new Date(lead.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          )}
                        </div>

                        {lead.message && (
                          <p className="text-xs text-[#4A3E38] bg-[#FFFDF9] p-3 rounded-xl border border-[#EADBCE] mt-2 italic">
                            &quot;{lead.message}&quot;
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
                        <a
                          href={whatsappLeadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold shadow-xs transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Chamar no WhatsApp</span>
                        </a>

                        <select
                          value={lead.status || 'novo'}
                          onChange={(e) => handleUpdateLeadStatus(lead.id!, e.target.value as ContactLead['status'])}
                          className="text-xs font-semibold bg-[#FFFDF9] border border-[#EADBCE] rounded-xl px-2.5 py-2 text-[#3C2212] focus:outline-hidden"
                        >
                          <option value="novo">Novo</option>
                          <option value="em_atendimento">Em Atendimento</option>
                          <option value="concluido">Concluído</option>
                          <option value="arquivado">Arquivado</option>
                        </select>

                        <button
                          onClick={() => handleDeleteLead(lead.id!)}
                          className="p-2 text-[#A89E96] hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Excluir lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
