# Pipeline environments

Arquivos de ambiente para um fluxo GitFlow com Jenkins, Docker e Kubernetes.

```txt
pipeline/env.dev  -> feature/* e develop
pipeline/env.stg  -> release/* e staging
pipeline/env.prd  -> main/master e tags de produção
```

Esses arquivos não devem guardar segredos. Use Jenkins Credentials, Secrets do Kubernetes ou outro cofre para tokens, credenciais de registry e kubeconfig.

## Variáveis

- `APP_ENV`: ambiente lógico da aplicação.
- `K8S_NAMESPACE`: namespace de destino.
- `K8S_CONTEXT`: contexto Kubernetes usado pelo agente Jenkins.
- `IMAGE_REPOSITORY`: registry/repositório da imagem Docker.
- `IMAGE_TAG_PREFIX`: prefixo da tag por ambiente.
- `WEATHER_API_BASE_URL`: base da API Open-Meteo.
- `WEATHER_API_TIMEOUT_MS`: timeout server-side da chamada de clima.

## Exemplo de uso no Jenkins

```bash
set -a
. pipeline/env.stg
set +a

npm ci
npm run lint
npm test -- --runInBand
npm run build

IMAGE_TAG="$IMAGE_TAG_PREFIX-$BUILD_NUMBER"
docker build -t "$IMAGE_REPOSITORY:$IMAGE_TAG" .
docker push "$IMAGE_REPOSITORY:$IMAGE_TAG"

kubectl config use-context "$K8S_CONTEXT"
kubectl -n "$K8S_NAMESPACE" create configmap weather-app-config \
  --from-literal=WEATHER_API_BASE_URL="$WEATHER_API_BASE_URL" \
  --from-literal=WEATHER_API_TIMEOUT_MS="$WEATHER_API_TIMEOUT_MS" \
  --dry-run=client -o yaml | kubectl apply -f -
kubectl -n "$K8S_NAMESPACE" set image deployment/weather-app \
  weather-app="$IMAGE_REPOSITORY:$IMAGE_TAG"
```
