import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('🚀 Iniciando arranque del backend...');
  const app = await NestFactory.create(AppModule);

  // Configuración de CORS refinada
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://frontend-ten-silk-42.vercel.app' // Tu URL de Vercel
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
  });

  // Pipes globales
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Endpoint de salud simple para verificar conectividad
  const server = app.getHttpAdapter().getInstance();
  server.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Puerto dinámico para Railway
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Backend listo y escuchando en el puerto: ${port}`);
}
bootstrap().catch(err => {
  console.error('❌ Error fatal durante el arranque:', err);
});