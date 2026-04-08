import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentsModule } from './departments/departments.module';
import { CensusModule } from './census/census.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CompaniesModule } from './companies/companies.module';
import { User } from './users/user.entity';
import { Company } from './companies/company.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const mysqlUrl = config.get<string>('MYSQL_URL');
        
        // Priorizar variables de Railway (MYSQLHOST, etc.) o MYSQL_URL
        const host = config.get<string>('MYSQLHOST') || config.get<string>('DB_HOST', 'localhost');
        const port = parseInt(config.get<string>('MYSQLPORT') || config.get<string>('DB_PORT', '3306'), 10);
        const username = config.get<string>('MYSQLUSER') || config.get<string>('DB_USER', 'root');
        const password = config.get<string>('MYSQLPASSWORD') || config.get<string>('DB_PASS', '');
        const database = config.get<string>('MYSQLDATABASE') || config.get<string>('DB_NAME', 'dygas_db');

        if (mysqlUrl) {
          console.log('🔗 Conectando a la base de datos vía: MYSQL_URL');
          return {
            type: 'mysql',
            url: mysqlUrl,
            entities: [User, Company],
            synchronize: true,
            autoLoadEntities: true,
            keepConnectionAlive: true,
          };
        }

        console.log(`🔗 Conectando a la base de datos en: ${host}:${port}`);
        console.log(`📂 Base de datos: ${database}, Usuario: ${username}`);

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [User, Company],
          synchronize: true,
          autoLoadEntities: true,
          keepConnectionAlive: true,
          ssl: host !== 'localhost' ? { rejectUnauthorized: false } : false,
          connectTimeout: 60000,
        };
      },
    }),


    DepartmentsModule,
    CensusModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],
})
export class AppModule {}
