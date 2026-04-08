"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const departments_module_1 = require("./departments/departments.module");
const census_module_1 = require("./census/census.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const companies_module_1 = require("./companies/companies.module");
const user_entity_1 = require("./users/user.entity");
const company_entity_1 = require("./companies/company.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => {
                    const mysqlUrl = config.get('MYSQL_URL');
                    if (mysqlUrl) {
                        return { type: 'mysql', url: mysqlUrl, entities: [user_entity_1.User, company_entity_1.Company], synchronize: true };
                    }
                    const host = config.get('DB_HOST', 'localhost');
                    return {
                        type: 'mysql',
                        host,
                        port: parseInt(config.get('DB_PORT', '3306'), 10),
                        username: config.get('DB_USER', 'root'),
                        password: config.get('DB_PASS', ''),
                        database: config.get('DB_NAME', 'dygas_db'),
                        entities: [user_entity_1.User, company_entity_1.Company],
                        synchronize: true,
                        ssl: host !== 'localhost' ? { rejectUnauthorized: false } : false,
                        connectTimeout: 60000,
                    };
                },
            }),
            departments_module_1.DepartmentsModule,
            census_module_1.CensusModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map