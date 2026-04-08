# Etapa de build
FROM node:18-alpine AS builder

WORKDIR /app

# Instalar dependencias necesarias para compilar
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci                    # instala TODAS las deps (incluyendo devDeps)

COPY . .
RUN npx nest build            # usa npx para asegurar que encuentra el CLI

# Verificar que el build generó el archivo esperado
RUN ls -la dist/

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev         # --omit=dev es la forma moderna (reemplaza --only=production)

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/main.js"]