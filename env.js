// Carrega variáveis em build tools (ex.: Vite/Vercel) e expõe em window.APP_CONFIG
const viteEnv = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};

window.APP_CONFIG = {
  ...(window.APP_CONFIG || {}),
  SUPABASE_URL: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || viteEnv.VITE_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || viteEnv.VITE_SUPABASE_ANON_KEY || ''
};
