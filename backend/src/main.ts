import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as http from 'http';

// --- DIAGNÓSTICO DE NIVEL 2 (ZERO DEPENDENCIES) ---
const diagnosticData = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  MYSQLHOST: process.env.MYSQLHOST ? '✅ OK' : '❌ MISSING',
  MYSQLUSER: process.env.MYSQLUSER ? '✅ OK' : '❌ MISSING',
  MYSQLDATABASE: process.env.MYSQLDATABASE ? '✅ OK' : '❌ MISSING',
  MYSQL_URL: process.env.MYSQL_URL ? '✅ OK' : '⚠️ NO DEFINIDA',
};

console.log('🔍 DIAGNÓSTICO INICIAL:', diagnosticData);

async function bootstrap() {
  console.log('🚀 Iniciando bootstrap de NestJS...');

  try {
    const app = await NestFactory.create(AppModule);

    // Cors dinámico para Vercel
    app.enableCors({
      origin: (origin, callback) => {
        if (!origin || /localhost/.test(origin) || /vercel\.app$/.test(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Bloqueado por CORS'));
        }
      },
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
      allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    });

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));

    // Endpoint de salud con NestJS
    const serverInstance = app.getHttpAdapter().getInstance();
    serverInstance.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', diagnostics: diagnosticData });
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend NestJS escuchando en puerto: ${port}`);
  } catch (err) {
    console.error('❌ FALLO CRÍTICO EN NESTJS:', err.message);
    startEmergencyServer(err.message);
  }
}

function startEmergencyServer(errorMessage: string) {
  console.log('⚠️ INICIANDO SERVIDOR DE EMERGENCIA (HTTP NATIVO)...');
  const port = parseInt(process.env.PORT || '3000', 10);

  const server = http.createServer((req, res) => {
    if (req.url === '/health' || req.url === '/') {
      res.writeHead(500, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      res.end(JSON.stringify({
        status: 'emergency_mode',
        message: 'El backend no pudo iniciar sesión correctamente',
        error: errorMessage,
        diagnostics: diagnosticData,
        hint: 'Verifica si la base de datos está vinculada en Railway y tiene las variables correctas.'
      }));
    } else {
      res.writeHead(404);
      res.end();
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`⚠️ Servidor de EMERGENCIA activo en puerto: ${port}`);
  });
}

bootstrap();