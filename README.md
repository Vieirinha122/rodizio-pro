# Rodízio Pro

Ferramenta de estudo para rodízio 5x1 no vôlei. PWA offline-first para ajudar levantadores e jogadores a entender posicionamento na recepção e infiltração.

## Stack

- React + Vite + TypeScript
- Tailwind CSS v4
- vite-plugin-pwa
- Lucide React

## Desenvolvimento

```bash
npm install
npm run dev
```

## Build de produção

```bash
npm run build
```

## Deploy na Vercel

1. Conecte o repositório na Vercel
2. Framework: Vite (detecta automaticamente)
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Deploy

O `vercel.json` já configura:
- SPA fallback (rewrites para index.html)
- Headers corretos para Service Worker e Manifest
- Cache otimizado para assets estáticos

## PWA

- Funciona offline após primeira visita
- Instalável no celular (Add to Home Screen)
- Atualização automática via `registerType: 'autoUpdate'`

## Sincronização entre celular e computador

As formações continuam salvas localmente, inclusive sem internet. Para sincronizá-las entre dispositivos, use o Supabase:

1. Crie um projeto no [Supabase](https://supabase.com).
2. No SQL Editor, execute [`supabase/schema.sql`](./supabase/schema.sql).
3. Em Authentication > URL Configuration, inclua as URLs do projeto (por exemplo, `http://localhost:5173/editor` e a URL da Vercel com `/editor`).
4. Copie [`.env.example`](./.env.example) para `.env.local` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
5. Em Authentication > Providers, mantenha o login por e-mail com magic link habilitado.

No editor, informe seu e-mail e abra o link recebido. Ao salvar uma formação, ela será enviada para a conta e carregada automaticamente em outro dispositivo autenticado.

## Estrutura

```
src/
  components/
    quadra/     # SVG da quadra, jogadores, rotas
    ui/         # controles genéricos
  domain/
    rodizio/    # tipos, tabelas de posição e dados táticos 5x1
  hooks/
  styles/
  App.tsx
  main.tsx
```
