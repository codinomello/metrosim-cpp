# 🚇 Metrô SP – Simulador de Rotas

Visualizador interativo do Metrô de São Paulo com cálculo de rotas via Dijkstra.

---

## 🗂 Estrutura do projeto

```
metro-map-simulator/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── main.tsx              ← Entrypoint React
    ├── App.tsx               ← Componente raiz
    ├── types/
    │   └── metro.ts          ← Interfaces TypeScript
    ├── data/
    │   └── metroData.ts      ← Estações, arestas e cores das linhas
    ├── utils/
    │   └── dijkstra.ts       ← Algoritmo de rota ótima
    ├── hooks/
    │   ├── useRouteCalculator.ts  ← Lógica de cálculo de rotas
    │   ├── useMapTransform.ts     ← Pan & zoom do mapa
    │   └── useRouteAnimation.ts  ← Animação do caminho
    └── components/
        ├── Sidebar.tsx       ← Painel lateral de controles
        └── MetroGraph.tsx    ← SVG interativo do grafo
```

---

## 🚀 Setup do zero (passo a passo)

### Pré-requisitos

- **Node.js 18+** → https://nodejs.org  
  Verifique com: `node -v`

- **npm** já vem com o Node (ou use `pnpm`/`yarn` se preferir)

---

### Opção A – Usar estes arquivos diretamente

```bash
# 1. Entre na pasta do projeto
cd metro-map-simulator

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev

# Abra http://localhost:5173
```

---

### Opção B – Criar do zero com Vite (para entender o setup)

```bash
# 1. Crie o projeto com o template React + TypeScript
npm create vite@latest metro-map-simulator -- --template react-ts

# 2. Entre na pasta
cd metro-map-simulator

# 3. Instale as dependências base (Vite já instala react e @types)
npm install

# 4. Rode para ver o template padrão funcionando
npm run dev
```

Depois substitua os arquivos gerados pelos deste projeto.

---

### O que cada arquivo de config faz

| Arquivo          | Papel                                                             |
|------------------|-------------------------------------------------------------------|
| `package.json`   | Lista dependências e scripts (`dev`, `build`, `preview`)          |
| `tsconfig.json`  | Configuração do TypeScript (targets, strict mode, JSX)            |
| `vite.config.ts` | Configura Vite: plugins React, porta do dev server, proxy de API  |
| `index.html`     | HTML raiz — Vite injeta o bundle aqui                             |
| `src/main.tsx`   | Monta a árvore React no `<div id="root">`                         |

---

## 🔌 Integrando com o backend C++

Quando seu backend estiver pronto, edite `src/hooks/useRouteCalculator.ts`:

```typescript
// Substitua a chamada ao dijkstra local por:
const response = await fetch(`/api/route?from=${origin}&to=${dest}`);
const data: RouteResponse = await response.json();
setPath(data.path);
```

Formato esperado do backend (já tipado em `src/types/metro.ts`):

```json
{
  "nodes": [{ "id": "Sé", "x": 480, "y": 610, "lines": ["azul"] }],
  "edges": [{ "from": "Sé", "to": "Luz", "line": "azul" }],
  "path": ["Sé", "São Bento", "Luz"]
}
```

Descomente o bloco `proxy` em `vite.config.ts` para redirecionar `/api` → `localhost:8080`.

---

## 📦 Build de produção

```bash
npm run build   # gera /dist com os arquivos estáticos
npm run preview # serve o build localmente para testar
```

---

## 🧩 Tecnologias

- **React 18** + **TypeScript 5** — UI reativa com tipagem forte
- **Vite 5** — dev server ultra-rápido com HMR
- **SVG nativo** — grafo renderizado sem dependências externas
- **Dijkstra** implementado do zero em TS — sem bibliotecas de grafo
