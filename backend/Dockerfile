FROM node:18-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]
