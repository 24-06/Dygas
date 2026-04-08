import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Modificamos esta parte para que sea más flexible en producción
  app.enableCors({
    origin: (origin, callback) => {
      // Esto permite que peticiones sin origen (como Postman) 
      // y cualquier origen (como tu Vercel) pasen sin bloqueos
      if (!origin || origin) {
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Railway inyecta automáticamente la variable PORT, si no existe usa 3000
  const port = process.env.PORT || 3000;
  
  // Importante: Usar '0.0.0.0' ayuda a que Railway exponga el servicio correctamente
  await app.listen(port, '0.0.0.0');
  
  console.log(`🔥 DYGAS Backend corriendo en el puerto: ${port}`);
}
bootstrap();