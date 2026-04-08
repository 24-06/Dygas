FROM node:18-alpine
WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

RUN ls -la /app/dist/ && cat /app/dist/main.js | head -5

EXPOSE 3000

CMD ["node", "/app/dist/main.js"]