// Fallback para configuração manual quando não houver build com import.meta.env
window.APP_CONFIG = {
  ...(window.APP_CONFIG || {}),
  SUPABASE_URL: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || window.SUPABASE_URL || '',
  SUPABASE_ANON_KEY: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || window.SUPABASE_ANON_KEY || ''
};
