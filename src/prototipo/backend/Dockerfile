# Uma única imagem para as três APIs e o bench: mesmo Node, mesmas dependências,
# mesmo build. Cada serviço do docker-compose escolhe o que executar.
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.base.json ./
COPY shared/package.json shared/
COPY api-monolito/package.json api-monolito/
COPY api-camadas/package.json api-camadas/
COPY api-clean/package.json api-clean/
COPY bench/package.json bench/
RUN npm ci --no-fund --no-audit
COPY . .
# Build + cobertura gerada aqui, para o bench ler as métricas dentro do contêiner.
RUN npm run build && npm run coverage && npm prune --omit=dev

FROM node:22-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app /app
EXPOSE 3000 3001 3002 3003
CMD ["node", "bench/dist/server.js"]
