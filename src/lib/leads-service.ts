import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { ContactLead } from './types';

const LOCAL_LEADS_KEY = 'thaisa_felix_leads_cache_v1';

/**
 * Salva um novo contato / pedido de agendamento no Supabase
 */
export async function createContactLead(
  lead: Omit<ContactLead, 'id' | 'created_at' | 'status'>
): Promise<{ success: boolean; message: string }> {
  const newLead: ContactLead = {
    ...lead,
    status: 'novo',
    created_at: new Date().toISOString(),
  };

  // Salvar no Supabase se configurado
  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contact_leads')
          .insert([
            {
              name: lead.name,
              phone: lead.phone,
              email: lead.email || '',
              service_type: lead.service_type || 'presencial',
              imc: lead.imc || null,
              message: lead.message || '',
              status: 'novo',
            },
          ]);

        if (!error) {
          return { success: true, message: 'Mensagem enviada com sucesso! Em breve entraremos em contato.' };
        }
        console.warn('Erro ao inserir lead no Supabase, salvando em fallback local:', error);
      } catch (err: unknown) {
        console.warn('Exceção ao inserir lead no Supabase:', err);
      }
    }
  }

  // Fallback local se o Supabase não estiver conectado
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem(LOCAL_LEADS_KEY);
      const list: ContactLead[] = existingStr ? JSON.parse(existingStr) : [];
      list.unshift({ ...newLead, id: `local_${Date.now()}` });
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('Falha ao salvar lead no localStorage:', e);
    }
  }

  return { 
    success: true, 
    message: 'Mensagem registrada com sucesso! Em breve a Thaísa responderá via WhatsApp.' 
  };
}

/**
 * Obtém todos os contatos e pedidos de agendamento (Área administrativa)
 */
export async function getContactLeads(): Promise<ContactLead[]> {
  if (isSupabaseConfigured) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_leads')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as ContactLead[];
        }
      } catch (err: unknown) {
        console.warn('Erro ao buscar leads do Supabase:', err);
      }
    }
  }

  // Fallback para cache local
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem(LOCAL_LEADS_KEY);
      if (existingStr) {
        return JSON.parse(existingStr);
      }
    } catch (e) {
      console.warn('Erro ao ler leads do localStorage:', e);
    }
  }

  return [];
}

/**
 * Atualiza o status de um lead (novo, em_atendimento, concluido, arquivado)
 */
export async function updateContactLeadStatus(
  id: string, 
  status: ContactLead['status']
): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith('local_')) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contact_leads')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);

        if (!error) return true;
      } catch (err: unknown) {
        console.warn('Erro ao atualizar status no Supabase:', err);
      }
    }
  }

  // Atualizar também no fallback local se existir
  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem(LOCAL_LEADS_KEY);
      if (existingStr) {
        const list: ContactLead[] = JSON.parse(existingStr);
        const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
        localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
        return true;
      }
    } catch (e) {
      console.warn('Erro ao atualizar lead no localStorage:', e);
    }
  }

  return false;
}

/**
 * Remove um lead
 */
export async function deleteContactLead(id: string): Promise<boolean> {
  if (isSupabaseConfigured && !id.startsWith('local_')) {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase
          .from('contact_leads')
          .delete()
          .eq('id', id);

        if (!error) return true;
      } catch (err: unknown) {
        console.warn('Erro ao deletar lead no Supabase:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existingStr = localStorage.getItem(LOCAL_LEADS_KEY);
      if (existingStr) {
        const list: ContactLead[] = JSON.parse(existingStr);
        const updated = list.filter((item) => item.id !== id);
        localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(updated));
        return true;
      }
    } catch (e) {
      console.warn('Erro ao deletar lead no localStorage:', e);
    }
  }

  return false;
}
