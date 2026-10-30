export interface SiteSettings {
  id?: string;
  bio_title: string;
  bio_content: string;
  whatsapp_number: string;
  whatsapp_secondary_number?: string;
  whatsapp_message: string;
  instagram_handle: string;
  email: string;
  address: string;
  payment_methods: string;
  background_theme: 'organic_fruits' | 'warm_waves' | 'clean_ivory' | 'soft_green' | 'custom_image';
  custom_bg_url?: string;
  updated_at?: string;
}

export interface ContactLead {
  id?: string;
  name: string;
  phone: string;
  email?: string;
  service_type?: 'presencial' | 'online' | 'acompanhamento' | 'duvida' | 'outro';
  imc?: number;
  message?: string;
  status?: 'novo' | 'em_atendimento' | 'concluido' | 'arquivado';
  created_at?: string;
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  bio_title: "Olá, sou a Thaísa Felix",
  bio_content: 
    "Sou nutricionista formada pela Universidade Federal do Rio de Janeiro (UFRJ), com foco em promover saúde, qualidade de vida e uma relação equilibrada com a alimentação. Atualmente, estou me especializando em obesidade e emagrecimento, aprofundando meus conhecimentos em estratégias nutricionais voltadas para a perda de peso sustentável, mudança de hábitos e melhoria da saúde metabólica.\n\n" +
    "Minha atuação é baseada em um atendimento humanizado e individualizado, respeitando a rotina, os objetivos e as necessidades de cada paciente. Acredito que a nutrição deve ser acolhedora e possível de ser aplicada no dia a dia, sem extremismos ou restrições desnecessárias.\n\n" +
    "Trabalho com foco em:\n\n" +
    "- Emagrecimento saudável e sustentável;\n" +
    "- Reeducação alimentar infantil e adulta;\n" +
    "- Nutrição comportamental;\n" +
    "- Prevenção e acompanhamento de doenças crônicas;\n" +
    "- Promoção da saúde e qualidade de vida.\n\n" +
    "Meu método de trabalho envolve escuta ativa, acompanhamento próximo e elaboração de planos alimentares personalizados, buscando resultados reais e duradouros. Gosto de trabalhar de forma leve, equilibrada e adaptada à realidade de cada pessoa, incentivando mudanças graduais que possam ser mantidas a longo prazo.",
  whatsapp_number: "5521983562064",
  whatsapp_secondary_number: "5521997201128",
  whatsapp_message: "Olá, Thaísa! Gostaria de informações sobre consulta nutricional.",
  instagram_handle: "nutrithaisafelix",
  email: "nutrithaisafelix@gmail.com",
  address: "R. Viúva Dantas, 214 - Sala 609, Campo Grande, Rio de Janeiro - RJ",
  payment_methods: "Pix ou Dinheiro",
  background_theme: "organic_fruits",
  custom_bg_url: "",
};
