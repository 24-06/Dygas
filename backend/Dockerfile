FROM node:18-alpine
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm @nestjs/cli

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install

# Copy source code
COPY . .

# Build the app
RUN pnpm run build

# Verify dist was created
RUN ls -la /app/dist/

EXPOSE 3000

CMD ["node", "/app/dist/main.js"]
