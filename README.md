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