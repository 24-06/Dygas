# --- Etapa de construcción ---
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar pnpm y dependencias de compilación para paquetes como bcrypt
RUN npm install -g pnpm && \
    apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml .npmrc ./

# Instalar TODAS las dependencias para poder buildear
RUN pnpm install --frozen-lockfile

COPY . .

# Limpiar cache incremental y construir
RUN rm -f tsconfig.build.tsbuildinfo && pnpm run build

# Eliminar dependencias de desarrollo y quedarnos solo con las de producción
# Esto limpia el node_modules preservando los binarios ya compilados
RUN pnpm install --prod --frozen-lockfile

# --- Etapa final ---
FROM node:20-alpine

WORKDIR /app

# Copiar solo lo necesario desde el builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/main.js"]