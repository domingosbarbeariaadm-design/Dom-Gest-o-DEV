# Integração Supabase - Domingos Barbearia

Objetivo: fazer o sistema atual usar o Supabase como banco online, mantendo o layout atual e mantendo localStorage como backup.

## Regras obrigatórias

- Não recriar o sistema do zero.
- Não apagar layout.
- Não remover módulos existentes.
- Não limpar localStorage.
- Manter localStorage como backup local.
- Ao abrir o sistema, tentar carregar dados do Supabase.
- Se Supabase falhar, carregar do localStorage.
- Ao salvar qualquer alteração, salvar no localStorage e também no Supabase.
- Criar botão/função para enviar os dados locais atuais para o Supabase.

## Variáveis já configuradas no Netlify

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Tabela simples inicial

Usar uma tabela única para preservar a estrutura atual do app:

```sql
create table if not exists public.app_state (
  id text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table public.app_state enable row level security;

drop policy if exists "app_state_select_all" on public.app_state;
drop policy if exists "app_state_insert_all" on public.app_state;
drop policy if exists "app_state_update_all" on public.app_state;

create policy "app_state_select_all" on public.app_state for select using (true);
create policy "app_state_insert_all" on public.app_state for insert with check (true);
create policy "app_state_update_all" on public.app_state for update using (true) with check (true);
```

## Código esperado

Adicionar integração usando Supabase JS via CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

Criar funções:

```js
const SUPABASE_URL = window.VITE_SUPABASE_URL || 'COLOCAR_URL_AQUI_SE_NAO_USAR_BUILD';
const SUPABASE_ANON_KEY = window.VITE_SUPABASE_ANON_KEY || 'COLOCAR_CHAVE_AQUI_SE_NAO_USAR_BUILD';
const SUPABASE_STATE_ID = 'domingos_barbearia_principal';
let supabaseClient = null;

function initSupabase(){
  if(!window.supabase || !SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('COLOCAR_')) return null;
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabaseClient;
}

async function loadFromSupabase(){
  try{
    const client = supabaseClient || initSupabase();
    if(!client) return null;
    const { data, error } = await client.from('app_state').select('data').eq('id', SUPABASE_STATE_ID).single();
    if(error || !data) return null;
    return data.data;
  }catch(e){
    console.warn('Falha ao carregar Supabase', e);
    return null;
  }
}

async function saveToSupabase(state){
  try{
    const client = supabaseClient || initSupabase();
    if(!client) return false;
    const { error } = await client.from('app_state').upsert({
      id: SUPABASE_STATE_ID,
      data: state,
      updated_at: new Date().toISOString()
    });
    if(error) throw error;
    return true;
  }catch(e){
    console.warn('Falha ao salvar Supabase', e);
    return false;
  }
}
```

Adaptar o carregamento atual:

- Primeiro tentar `loadFromSupabase()`.
- Se retornar dados, usar esses dados no estado principal do sistema e também salvar no localStorage.
- Se não retornar, carregar do localStorage como já funciona hoje.

Adaptar a função `save()` atual:

- Continuar salvando no localStorage.
- Depois chamar `saveToSupabase(d)` ou o nome do objeto principal atual.

Criar botão em Backup ou Configurações:

- "Enviar dados deste aparelho para a nuvem"
- Ação: pegar o estado local atual e chamar `saveToSupabase(d)`.

## Resultado esperado

Depois de publicado no Netlify:

- Cadastrar cliente no tablet deve aparecer no celular.
- Agenda deve ser a mesma em todos os aparelhos.
- Financeiro deve abrir com os mesmos dados.
- Se ficar sem internet, localStorage continua servindo como backup.
