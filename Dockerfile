# Etapa 1: compilar el cliente (React + Vite)
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Etapa 2: instalar el servidor (Express) y copiar el cliente ya compilado
FROM node:20-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --omit=dev
COPY server/ ./
COPY --from=client-build /app/client/dist ../client/dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
