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
exports.MonitoringController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const monitoring_service_1 = require("./monitoring.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let MonitoringController = class MonitoringController {
    monitoringService;
    constructor(monitoringService) {
        this.monitoringService = monitoringService;
    }
    startSession(examId) {
        return this.monitoringService.startSession(examId);
    }
    endSession(sessionId) {
        return this.monitoringService.endSession(sessionId);
    }
    getSession(id) {
        return this.monitoringService.getSession(id);
    }
    getSessionStudents(id) {
        return this.monitoringService.getSessionStudents(id);
    }
    getSessionHistory(id) {
        return this.monitoringService.getSessionHistory(id);
    }
    getSessionStatistics(id) {
        return this.monitoringService.getSessionStatistics(id);
    }
};
exports.MonitoringController = MonitoringController;
__decorate([
    (0, common_1.Post)('start/:examId'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.PROFESSOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Start a monitoring session for an exam' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session successfully started' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Exam not found' }),
    __param(0, (0, common_1.Param)('examId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "startSession", null);
__decorate([
    (0, common_1.Post)('end/:sessionId'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.PROFESSOR),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'End a monitoring session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Session successfully ended' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('sessionId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "endSession", null);
__decorate([
    (0, common_1.Get)('session/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monitoring session details by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return session details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSession", null);
__decorate([
    (0, common_1.Get)('session/:id/students'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of students in the session and their latest biosignals' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of assigned students with real-time telemetry status' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSessionStudents", null);
__decorate([
    (0, common_1.Get)('session/:id/history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full telemetry logs history for a session' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return full list of recorded telemetry points' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSessionHistory", null);
__decorate([
    (0, common_1.Get)('session/:id/statistics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get aggregated statistics of stress levels and heart rate' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return statistical summary of telemetry data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Session not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MonitoringController.prototype, "getSessionStatistics", null);
exports.MonitoringController = MonitoringController = __decorate([
    (0, swagger_1.ApiTags)('monitoring'),
    (0, common_1.Controller)('monitoring'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [monitoring_service_1.MonitoringService])
], MonitoringController);
//# sourceMappingURL=monitoring.controller.js.map