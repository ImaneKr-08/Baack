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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const qr_codes_service_1 = require("./qr-codes.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let QrCodesController = class QrCodesController {
    qrCodesService;
    constructor(qrCodesService) {
        this.qrCodesService = qrCodesService;
    }
    async generate(tableId) {
        const dataUrl = await this.qrCodesService.generateQrCodeForTable(tableId);
        return { tableId, qrCode: dataUrl };
    }
    async generateBatch(classroomId) {
        return this.qrCodesService.generateBatchForClassroom(classroomId);
    }
    async download(tableId, res) {
        const { buffer, filename } = await this.qrCodesService.getQrCodeBuffer(tableId);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(buffer);
    }
};
exports.QrCodesController = QrCodesController;
__decorate([
    (0, common_1.Post)('generate/:tableId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR code for a table (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR code generated as base64 data URL' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found' }),
    __param(0, (0, common_1.Param)('tableId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('generate-batch/:classroomId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Generate QR codes for all tables in a classroom (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'QR codes batch generation complete' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('classroomId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "generateBatch", null);
__decorate([
    (0, common_1.Get)('download/:tableId'),
    (0, swagger_1.ApiOperation)({ summary: 'Download QR code image for a table' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns PNG file download' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Table not found' }),
    __param(0, (0, common_1.Param)('tableId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], QrCodesController.prototype, "download", null);
exports.QrCodesController = QrCodesController = __decorate([
    (0, swagger_1.ApiTags)('qr-codes'),
    (0, common_1.Controller)('qr'),
    __metadata("design:paramtypes", [qr_codes_service_1.QrCodesService])
], QrCodesController);
//# sourceMappingURL=qr-codes.controller.js.map