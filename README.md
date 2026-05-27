# Weather App

Aplicação desenvolvida para o desafio de front-end. Ela lista as cidades exigidas no teste e, ao selecionar uma delas, exibe uma tela de clima fiel ao layout do Figma para mobile e desktop.

## Demo e deploy

O projeto está pronto para deploy na Vercel e também para execução em Docker/Kubernetes.

- Framework: Next.js 16 com App Router
- Runtime: Node.js
- Build: `npm run build`
- Start: `npm run start`
- Porta padrão do container: `3000`

## Requisitos atendidos

- Lista das cidades exigidas:
  - Dallol (NG)
  - Fairbanks (US)
  - Londres (GB)
  - Recife (BR)
  - Vancouver (CA)
  - Yakutsk (RU)
- Tela inicial com seleção de cidade.
- Tela de detalhe com temperatura atual, condição climática, máxima, mínima, períodos do dia, vento, nascer do sol, pôr do sol e umidade.
- Períodos do dia conforme o enunciado:
  - Dawn: 03:00
  - Morning: 09:00
  - Afternoon: 15:00
  - Night: 21:00
- Layout responsivo para smartphone, tablet e desktop.
- Testes unitários com Jest e React Testing Library.
- Integração com API pública de clima.
- Suporte a Docker como diferencial.
- Manifests Kubernetes para pipeline com Jenkins/K8s.

## Stack

- Next.js 16.2.6
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- TanStack Query
- Jest
- React Testing Library
- Open-Meteo API

## Como rodar localmente

```bash
npm install
npm run dev
```

A aplicação estará disponível em:

```txt
http://localhost:3000
```

A rota `/` redireciona para:

```txt
http://localhost:3000/home
```

## Variáveis de ambiente

Crie um `.env.local` a partir do `.env.example`:

```bash
cp .env.example .env.local
```

Variáveis usadas no servidor:

```txt
WEATHER_API_BASE_URL=https://api.open-meteo.com/v1
WEATHER_API_TIMEOUT_MS=1200
```

Essas variáveis não usam `NEXT_PUBLIC_` porque a chamada real para a Open-Meteo acontece no servidor, dentro da API route interna.

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm test
npm run test:watch
npm run test:coverage
```

## Testes

Os testes ficam centralizados em `src/__tests__`, organizados por domínio para facilitar a leitura:

```txt
src/__tests__/
  app/
  constants/
  services/
```

Cobertura implementada:

- Links da tela inicial com prefetch/cache
- Constantes do desafio
- Serviço client da API interna
- Serviço server da Open-Meteo e fallback
- API route de clima
- API route de health check

Comandos de validação:

```bash
npm run lint
npm test -- --runInBand
npm run build
```

Resultado atual:

```txt
Test Suites: 17 passed, 17 total
Tests: 49 passed, 49 total
```

## Arquitetura

```txt
src/app/
  page.tsx                         redireciona / para /home
  home/page.tsx                    rota inicial da aplicação
  WeatherCityLinks.tsx             links da home com prefetch/cache
  layout.tsx                       layout raiz
  providers.tsx                    providers client, incluindo TanStack Query
  globals.css                      tokens visuais e estilos globais
  api/health/route.ts              health check para Docker/Kubernetes
  api/weather/[city]/route.ts      API route interna para clima
  weather/[city]/page.tsx          valida cidade e renderiza a tela client
  weather/[city]/WeatherClient.tsx tela de clima com TanStack Query
  weather/[city]/(components)/     componentes específicos da tela de clima
  weather/[city]/loading.tsx       loading da rota

src/constants/
  index.ts                         cidades e horários exigidos

src/services/
  weatherService.ts                integração server com Open-Meteo
  weatherClientService.ts          fetch client para API interna

src/types/
  weather.ts                       tipos compartilhados

src/__tests__/
  app/                             testes de rotas e componentes específicos do app
  constants/                       testes das cidades e horários do desafio
  services/                        testes dos serviços client/server

pipeline/
  env.dev                          variáveis para ambiente de desenvolvimento
  env.stg                          variáveis para ambiente de staging
  env.prd                          variáveis para ambiente de produção
```

Regra usada na organização: arquivos de rota, layout, API routes e providers ficam em `src/app`; código reutilizável ou testável fora do roteamento fica na base de `src`.

## Fluxo de dados

1. O usuário acessa `/`.
2. `src/app/page.tsx` redireciona para `/home`.
3. `src/app/home/page.tsx` renderiza as cidades de `src/constants`.
4. `WeatherCityLinks` faz prefetch ao focar, passar o mouse ou tocar em uma cidade.
5. O clique navega normalmente com `Link`, deixando o `loading.tsx` cuidar da transição da rota.
6. A rota `/weather/[city]` valida a cidade.
7. `WeatherClient` lê os dados com TanStack Query usando a mesma query key do prefetch.
8. O client chama `/api/weather/[city]`.
9. A API route chama `fetchWeatherData` no servidor.
10. `weatherService.ts` busca os dados na Open-Meteo.
11. Se a API falhar ou demorar, o serviço devolve fallback local por cidade.

## Por que TanStack Query + API route

A API de clima é pública, mas a aplicação ainda usa uma API route interna por três motivos:

- manter variáveis de ambiente e regras de timeout no servidor;
- centralizar fallback e transformação de dados;
- permitir cache, prefetch e reuso no client com TanStack Query.

O resultado é uma navegação simples e previsível: o `Link` navega direto, o `loading.tsx` cobre a transição da rota e o TanStack Query reaproveita cache quando existir.

## Docker

O projeto usa `output: "standalone"` no `next.config.ts`, gerando uma imagem menor com os arquivos necessários para produção.

O Dockerfile usa multi-stage build com a imagem oficial `node:22-alpine3.22`:

- stage `deps` para instalar dependências com `npm ci`;
- stage `builder` para gerar o build standalone do Next.js;
- stage `runner` para executar somente os arquivos necessários em produção, usando usuário não-root.

Build da imagem:

```bash
docker build -t weather-app:latest .
```

Execução local:

```bash
docker run --rm -p 3000:3000 \
  -e WEATHER_API_BASE_URL=https://api.open-meteo.com/v1 \
  -e WEATHER_API_TIMEOUT_MS=1200 \
  weather-app:latest
```

Execucao local em background com nome fixo:

```bash
docker run -d --rm --name weather-app-test -p 3000:3000 \
  -e WEATHER_API_BASE_URL=https://api.open-meteo.com/v1 \
  -e WEATHER_API_TIMEOUT_MS=1200 \
  weather-app:latest
```

Se a porta `3000` ja estiver ocupada na maquina, exponha outra porta no host, mantendo `3000` dentro do container:

```bash
docker run -d --rm --name weather-app-test -p 3001:3000 \
  -e WEATHER_API_BASE_URL=https://api.open-meteo.com/v1 \
  -e WEATHER_API_TIMEOUT_MS=1200 \
  weather-app:latest
```

A aplicacao ficara disponivel em:

```txt
http://localhost:3000
```

ou, no exemplo com porta alternativa:

```txt
http://localhost:3001
```

Health check:

```txt
http://localhost:3000/api/health
```

Health check na porta alternativa:

```txt
http://localhost:3001/api/health
```

Ver logs do container:

```bash
docker logs -f weather-app-test
```

Parar o container:

```bash
docker stop weather-app-test
```

## Kubernetes

Os manifests ficam em `k8s/`:

```txt
k8s/configmap.yaml
k8s/deployment.yaml
k8s/service.yaml
k8s/ingress.yaml
k8s/kustomization.yaml
```

Aplicar no cluster:

```bash
kubectl apply -k k8s
```

Em um pipeline Jenkins, o fluxo esperado é:

```bash
npm ci
npm run lint
npm test -- --runInBand
npm run build
docker build -t registry.example.com/weather-app:$BUILD_NUMBER .
docker push registry.example.com/weather-app:$BUILD_NUMBER
kubectl set image deployment/weather-app weather-app=registry.example.com/weather-app:$BUILD_NUMBER
```

Antes de aplicar em produção, troque a imagem em `k8s/deployment.yaml` pelo registry real.

## Pipeline GitFlow

A pasta `pipeline/` contém arquivos de ambiente por estágio:

```txt
pipeline/env.dev
pipeline/env.stg
pipeline/env.prd
```

Eles seguem um fluxo GitFlow comum:

- `feature/*` e `develop`: `env.dev`
- `release/*`: `env.stg`
- `main`, `master` ou tags: `env.prd`

Esses arquivos não carregam segredos. Tokens, kubeconfig e credenciais de registry devem ficar no Jenkins Credentials, em Secrets do Kubernetes ou em outro cofre.

## Deploy na Vercel

1. Suba o projeto para um repositório Git.
2. Importe o projeto na Vercel.
3. A Vercel detecta Next.js automaticamente.
4. Configure as variáveis de ambiente:
   - `WEATHER_API_BASE_URL`
   - `WEATHER_API_TIMEOUT_MS`
5. Use os comandos padrão:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output: gerenciado pela Vercel para Next.js

Observação: o Dockerfile é voltado para execução em infraestrutura própria, Jenkins e Kubernetes. Na Vercel, o caminho mais simples é o deploy nativo de Next.js.

## API utilizada

A integração usa a Open-Meteo:

```txt
https://api.open-meteo.com/v1/forecast
```

Campos usados:

- `current`: temperatura atual, condição, umidade e vento.
- `hourly`: temperaturas e condições às 03:00, 09:00, 15:00 e 21:00.
- `daily`: máxima, mínima, nascer do sol e pôr do sol.

## Decisões técnicas para explicar

- App Router foi escolhido por ser o padrão atual do Next.js.
- A home é majoritariamente Server Component, mas os links de cidade são client para permitir prefetch.
- A chamada externa fica no servidor para não espalhar regra de API no client.
- TanStack Query foi usado para cache, prefetch e reuso entre navegações.
- O fallback local evita uma experiência quebrada se a API pública falhar durante a avaliação.
- A imagem Docker usa standalone output para reduzir arquivos no runtime.
- O health check existe para readiness/liveness no Kubernetes.
