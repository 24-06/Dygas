"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http = __importStar(require("http"));
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
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: (origin, callback) => {
                if (!origin || /localhost/.test(origin) || /vercel\.app$/.test(origin)) {
                    callback(null, true);
                }
                else {
                    callback(new Error('Bloqueado por CORS'));
                }
            },
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
            allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        const serverInstance = app.getHttpAdapter().getInstance();
        serverInstance.get('/health', (req, res) => {
            res.status(200).json({ status: 'ok', diagnostics: diagnosticData });
        });
        const port = process.env.PORT || 3000;
        await app.listen(port, '0.0.0.0');
        console.log(`✅ Backend NestJS escuchando en puerto: ${port}`);
    }
    catch (err) {
        console.error('❌ FALLO CRÍTICO EN NESTJS:', err.message);
        startEmergencyServer(err.message);
    }
}
function startEmergencyServer(errorMessage) {
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
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
    server.listen(port, '0.0.0.0', () => {
        console.log(`⚠️ Servidor de EMERGENCIA activo en puerto: ${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map