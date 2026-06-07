"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PrismaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const adapter_mariadb_1 = require("@prisma/adapter-mariadb");
let PrismaService = PrismaService_1 = class PrismaService extends client_1.PrismaClient {
    static createAdapter() {
        const dbUrl = process.env.DATABASE_URL;
        let host = process.env.DATABASE_HOST || 'localhost';
        let port = parseInt(process.env.DATABASE_PORT || '3306', 10);
        let user = process.env.DATABASE_USER || 'root';
        let password = process.env.DATABASE_PASSWORD || '';
        let database = process.env.DATABASE_NAME || '';
        if (dbUrl) {
            try {
                const parsed = new URL(dbUrl);
                host = parsed.hostname;
                port = parsed.port ? parseInt(parsed.port, 10) : 3306;
                user = decodeURIComponent(parsed.username);
                password = decodeURIComponent(parsed.password);
                database = parsed.pathname.replace(/^\//, '');
            }
            catch (err) {
                console.error('Failed to parse DATABASE_URL, fallback to env vars:', err);
            }
        }
        const sslConfig = (dbUrl?.includes('ssl-mode=REQUIRED') || dbUrl?.includes('ssl=true'))
            ? { rejectUnauthorized: false }
            : undefined;
        const config = {
            host,
            port,
            user,
            password,
            database,
            connectionLimit: 10,
            ssl: sslConfig,
        };
        return new adapter_mariadb_1.PrismaMariaDb(config);
    }
    constructor() {
        super({
            adapter: PrismaService_1.createAdapter(),
        });
    }
    async onModuleInit() {
        await this.$connect();
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
};
exports.PrismaService = PrismaService;
exports.PrismaService = PrismaService = PrismaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], PrismaService);
//# sourceMappingURL=prisma.service.js.map