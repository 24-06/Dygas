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
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: parseInt(config.get<string>('DB_PORT', '3306'), 10),
        username: config.get<string>('DB_USER', 'root'),
        password: config.get<string>('DB_PASS', ''),
        database: config.get<string>('DB_NAME', 'dygas_db'),
        entities: [User, Company],
        synchronize: true,
        ssl: config.get('DB_HOST', 'localhost') !== 'localhost'
          ? { rejectUnauthorized: false }
          : false,
        connectTimeout: 60000,
        retryAttempts: 3,
        retryDelay: 3000,
      }),
    }),
    DepartmentsModule,
    CensusModule,
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],
})
export class AppModule {}
