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
        if (mysqlUrl) {
          console.log('🔗 Intentando conectar a DB vía MYSQL_URL...');
          return {
            type: 'mysql',
            url: mysqlUrl,
            entities: [User, Company],
            synchronize: true,
            autoLoadEntities: true,
            keepConnectionAlive: true,
          };
        }
        const host = config.get<string>('DB_HOST', 'localhost');
        console.log(`🔗 Intentando conectar a DB en host: ${host}`);
        return {
          type: 'mysql',
          host,
          port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
          username: config.get<string>('DB_USER', 'root'),
          password: config.get<string>('DB_PASS', ''),
          database: config.get<string>('DB_NAME', 'dygas_db'),
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
