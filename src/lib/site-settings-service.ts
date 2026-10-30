import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { SiteSettings, DEFAULT_SITE_SETTINGS } from './types';

const LOCAL_STORAGE_KEY = 'thaisa_felix_site_settings_v1';

export async function getSiteSettings(): Promise<SiteSettings> {
  // 1. Tentar carregar do Supabase se configurado
  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (!error && data) {
          return {
            ...DEFAULT_SITE_SETTINGS,
            ...data,
          };
        }
      } catch (err: unknown) {
        console.warn('Erro ao carregar do Supabase, recorrendo ao cache local:', err);
      }
    }
  }

  // 2. Fallback para localStorage no navegador
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
        };
      }
    } catch (e: unknown) {
      console.warn('Erro ao ler localStorage:', e);
    }
  }

  // 3. Fallback para os valores padrão
  return DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: SiteSettings): Promise<{ success: boolean; message: string }> {
  // Salvar sempre localmente para garantia de persistência imediata
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (e: unknown) {
      console.warn('Erro ao salvar no localStorage:', e);
    }
  }

  // Salvar no Supabase se configurado
  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Verificar se já existe registro
        const { data: existing } = await supabase
          .from('site_settings')
          .select('id')
          .limit(1)
          .maybeSingle();

        const payload = {
          bio_title: settings.bio_title,
          bio_content: settings.bio_content,
          whatsapp_number: settings.whatsapp_number,
          whatsapp_secondary_number: settings.whatsapp_secondary_number,
          whatsapp_message: settings.whatsapp_message,
          instagram_handle: settings.instagram_handle,
          email: settings.email,
          address: settings.address,
          payment_methods: settings.payment_methods,
          background_theme: settings.background_theme,
          custom_bg_url: settings.custom_bg_url,
          updated_at: new Date().toISOString(),
        };

        if (existing?.id) {
          const { error } = await supabase
            .from('site_settings')
            .update(payload)
            .eq('id', existing.id);

          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert([payload]);

          if (error) throw error;
        }

        return { success: true, message: 'Configurações salvas e sincronizadas no Supabase com sucesso!' };
      } catch (err: unknown) {
        console.error('Erro ao salvar no Supabase:', err);
        const errorMsg = err instanceof Error ? err.message : String(err);
        return { 
          success: true, 
          message: `Salvo no navegador! (Aviso Supabase: ${errorMsg})` 
        };
      }
    }
  }

  return {
    success: true,
    message: 'Configurações salvas localmente no navegador com sucesso!',
  };
}
