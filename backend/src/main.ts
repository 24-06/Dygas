import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('🚀 Iniciando arranque del backend...');
  
  const diagnosticData = {
    PORT: process.env.PORT || '3000',
    MYSQLHOST: process.env.MYSQLHOST ? '✅ OK' : '❌ MISSING',
    MYSQLUSER: process.env.MYSQLUSER ? '✅ OK' : '❌ MISSING',
    MYSQLDATABASE: process.env.MYSQLDATABASE ? '✅ OK' : '❌ MISSING',
    MYSQL_URL: process.env.MYSQL_URL ? '✅ OK' : '⚠️ NO DEFINIDA',
    DATABASE_URL: process.env.DATABASE_URL ? '✅ OK' : '⚠️ NO DEFINIDA',
  };

  console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO:', diagnosticData);

  try {
    const app = await NestFactory.create(AppModule);

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

    const server = app.getHttpAdapter().getInstance();
    server.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok', diagnostics: diagnosticData });
    });

    const port = process.env.PORT || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`✅ Backend listo y escuchando en el puerto: ${port}`);
  } catch (err) {
    console.error('❌ Error fatal durante el arranque del AppModule:', err.message);
    console.log('⚠️ Iniciando servidor de emergencia para diagnóstico...');
    
    // Servidor de emergencia si NestJS falla
    const express = require('express');
    const emergencyApp = express();
    emergencyApp.get('/health', (req, res) => {
      res.status(500).json({ 
        status: 'error', 
        message: 'El backend no pudo iniciar sesión correctamente con la base de datos',
        error: err.message,
        diagnostics: diagnosticData 
      });
    });
    const port = process.env.PORT || 3000;
    emergencyApp.listen(port, '0.0.0.0', () => {
      console.log(`⚠️ Servidor de EMERGENCIA escuchando en el puerto: ${port}`);
    });
  }
}
bootstrap();