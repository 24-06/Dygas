# --- Etapa de construcción ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm y dependencias de compilación
RUN npm install -g pnpm && \
    apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml .npmrc ./

# IMPORTANTE: Configurar pnpm para que cree un node_modules plano y sin enlaces simbólicos frágiles
# Esto soluciona los fallos de carga en entornos Docker multi-etapa
RUN pnpm config set node-linker hoisted && \
    pnpm install --frozen-lockfile

COPY . .

# Construir la aplicación
RUN pnpm run build

# Limpiar dependencias de desarrollo (manteniendo el linker hoisted para estabilidad)
RUN pnpm prune --prod --no-optional

# --- Etapa final ---
FROM node:20-alpine

WORKDIR /app

# Copiar el node_modules plano generado en el builder (ahora es seguro copiarlo)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

# El punto de entrada es dist/main.js según la estructura de NestJS
CMD ["node", "dist/main.js"]