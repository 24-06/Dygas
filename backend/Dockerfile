FROM node:18-alpine
WORKDIR /app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Confirm dist exists
RUN ls -la dist/ && echo "Build successful!"

EXPOSE 3000

CMD ["node", "dist/main.js"]
