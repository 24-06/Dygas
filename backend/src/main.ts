import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  console.log('🚀 Iniciando arranque del backend...');
  
  // --- DIAGNÓSTICO DE VARIABLES PARA EL USUARIO ---
  console.log('🔍 DIAGNÓSTICO DE VARIABLES DE ENTORNO:');
  console.log('  - PORT:', process.env.PORT || 'X (usando 3000)');
  console.log('  - MYSQLHOST:', process.env.MYSQLHOST ? '✅ OK' : '❌ MISSING');
  console.log('  - MYSQLUSER:', process.env.MYSQLUSER ? '✅ OK' : '❌ MISSING');
  console.log('  - MYSQLDATABASE:', process.env.MYSQLDATABASE ? '✅ OK' : '❌ MISSING');
  console.log('  - MYSQL_URL:', process.env.MYSQL_URL ? '✅ OK' : '⚠️ NO DEFINIDA');
  // ------------------------------------------------

  const app = await NestFactory.create(AppModule);

  // Configuración de CORS dinámica
  app.enableCors({
    origin: (origin, callback) => {
      // Permitir si no hay origen (como Postman) o si es localhost o Vercel
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