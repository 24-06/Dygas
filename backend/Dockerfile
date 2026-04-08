FROM node:18-alpine
WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]