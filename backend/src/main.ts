import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ESTA CONFIGURACIÓN ELIMINA CUALQUIER BLOQUEO DE COMUNICACIÓN
  app.enableCors({
    origin: true, // Permite cualquier origen (Vercel, Localhost, Celular)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  // Escuchamos en 0.0.0.0 para que Railway sea accesible externamente
  await app.listen(port, '0.0.0.0');
}
bootstrap();