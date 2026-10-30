import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseAnonKey.trim() !== '' &&
  supabaseUrl.startsWith('http') && 
  !supabaseUrl.includes('seu-projeto') &&
  !supabaseUrl.includes('your-project')
);

// Singleton do cliente Supabase para reutilização segura
let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) {
    return null;
  }

  if (clientInstance) {
    return clientInstance;
  }

  if (typeof window !== 'undefined') {
    clientInstance = createBrowserClient(supabaseUrl!, supabaseAnonKey!);
  } else {
    clientInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  }

  return clientInstance;
}

export const supabase = getSupabaseClient();

/**
 * Diagnóstico de conexão em tempo real com o Supabase
 */
export async function testSupabaseConnection(): Promise<{
  ok: boolean;
  message: string;
  url?: string;
  latencyMs?: number;
}> {
  if (!supabaseUrl) {
    return { ok: false, message: 'NEXT_PUBLIC_SUPABASE_URL não configurada no .env.local' };
  }

  if (!supabaseAnonKey || supabaseAnonKey.trim() === '') {
    return { 
      ok: false, 
      message: 'Chave pública (NEXT_PUBLIC_SUPABASE_ANON_KEY) ainda não foi inserida no .env.local',
      url: supabaseUrl 
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { ok: false, message: 'Falha ao inicializar o cliente Supabase', url: supabaseUrl };
  }

  const startTime = Date.now();
  try {
    // Tenta uma consulta simples à tabela site_settings
    const { error } = await client
      .from('site_settings')
      .select('id')
      .limit(1);

    const latencyMs = Date.now() - startTime;

    if (error) {
      // Se a tabela ainda não existir, mas conectou ao banco
      if (error.code === 'PGRST205' || error.message.includes('relation "public.site_settings" does not exist')) {
        return {
          ok: false,
          message: 'Conectado ao Supabase, mas a tabela "site_settings" ainda não foi criada. Execute o schema.sql no SQL Editor!',
          url: supabaseUrl,
          latencyMs,
        };
      }
      return {
        ok: false,
        message: `Erro do Supabase: ${error.message} (Código: ${error.code})`,
        url: supabaseUrl,
        latencyMs,
      };
    }

    return {
      ok: true,
      message: 'Conexão com o Supabase estabelecida com sucesso!',
      url: supabaseUrl,
      latencyMs,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: `Falha na requisição de rede: ${errorMsg}`,
      url: supabaseUrl,
    };
  }
}
