FROM node:18-alpine AS builder
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
    && pnpm install --frozen-lockfile \
    && apk del .build-deps
COPY . .
# Eliminar cache incremental antes de buildear
RUN rm -f tsconfig.build.tsbuildinfo && pnpm run build

# --- Imagen final ---
FROM node:18-alpine
WORKDIR /app
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]