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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const QRCode = __importStar(require("qrcode"));
let QrCodesService = class QrCodesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateQrCodeForTable(tableId) {
        const table = await this.prisma.table.findUnique({
            where: { id: tableId },
        });
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${tableId} not found`);
        }
        const qrContent = `proctorinsight://table/${tableId}`;
        const dataUrl = await QRCode.toDataURL(qrContent, {
            errorCorrectionLevel: 'H',
            margin: 2,
            width: 300,
        });
        await this.prisma.table.update({
            where: { id: tableId },
            data: { qrCode: dataUrl },
        });
        return dataUrl;
    }
    async generateBatchForClassroom(classroomId) {
        const classroom = await this.prisma.classroom.findUnique({
            where: { id: classroomId },
            include: { tables: true },
        });
        if (!classroom) {
            throw new common_1.NotFoundException(`Classroom with ID ${classroomId} not found`);
        }
        const updatedTables = [];
        for (const table of classroom.tables) {
            const dataUrl = await this.generateQrCodeForTable(table.id);
            updatedTables.push({ tableId: table.id, qrCode: dataUrl });
        }
        return {
            classroomId,
            totalGenerated: updatedTables.length,
            tables: updatedTables,
        };
    }
    async getQrCodeBuffer(tableId) {
        const table = await this.prisma.table.findUnique({
            where: { id: tableId },
        });
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${tableId} not found`);
        }
        let qrCode = table.qrCode;
        if (!qrCode) {
            qrCode = await this.generateQrCodeForTable(tableId);
        }
        const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        return {
            buffer,
            filename: `table-${tableId}-qr.png`,
        };
    }
};
exports.QrCodesService = QrCodesService;
exports.QrCodesService = QrCodesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QrCodesService);
//# sourceMappingURL=qr-codes.service.js.map