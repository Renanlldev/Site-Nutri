import { getSupabaseClient, isSupabaseConfigured } from './supabase';

const BUCKET_NAME = 'site-assets';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  error?: string;
}

/**
 * Faz upload de uma imagem para o bucket 'site-assets' do Supabase Storage
 */
export async function uploadSiteAsset(
  file: File, 
  folder: 'backgrounds' | 'photos' | 'misc' = 'backgrounds'
): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase não está configurado. Conecte suas credenciais no .env.local para fazer upload de imagens para a nuvem.',
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      success: false,
      error: 'Não foi possível inicializar o cliente do Supabase.',
    };
  }

  // Validação de formato
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!validTypes.includes(file.type)) {
    return {
      success: false,
      error: 'Formato de imagem inválido. Formatos suportados: JPG, PNG, WEBP, GIF.',
    };
  }

  // Validação de tamanho (máximo 5MB)
  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: 'Arquivo muito grande. O tamanho máximo permitido é de 5MB.',
    };
  }

  try {
    // Sanitizar nome do arquivo e adicionar timestamp único
    const cleanFileName = file.name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .toLowerCase();
    
    const filePath = `${folder}/${Date.now()}_${cleanFileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      // Se o bucket não existir, informar claramente
      if (error.message.includes('bucket not found') || error.message.includes('not found')) {
        return {
          success: false,
          error: 'Bucket "site-assets" não encontrado no Supabase. Execute o script schema.sql no SQL Editor!',
        };
      }
      return {
        success: false,
        error: `Erro no upload: ${error.message}`,
      };
    }

    // Obter URL pública do arquivo
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Erro inesperado durante o upload: ${message}`,
    };
  }
}
