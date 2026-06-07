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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MlService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const realtime_gateways_1 = require("../realtime/gateways/realtime.gateways");
const client_1 = require("@prisma/client");
let MlService = class MlService {
    prisma;
    realtimeGateway;
    constructor(prisma, realtimeGateway) {
        this.prisma = prisma;
        this.realtimeGateway = realtimeGateway;
    }
    async processStressData(dto) {
        const { esp32_id, stress_level, confidence, normalized } = dto;
        const student = await this.prisma.student.findUnique({
            where: { braceletId: esp32_id },
        });
        if (!student) {
            throw new common_1.NotFoundException(`No student assigned to bracelet ID ${esp32_id}`);
        }
        let mappedLevel = client_1.StressLevel.BASELINE;
        const lowerLevel = stress_level.toLowerCase();
        if (lowerLevel.includes('high')) {
            mappedLevel = client_1.StressLevel.HIGH_STRESS;
        }
        else if (lowerLevel.includes('mild')) {
            mappedLevel = client_1.StressLevel.MILD_STRESS;
        }
        const heartRate = Math.round(normalized.hr_norm * 50 + 60);
        await this.prisma.student.update({
            where: { id: student.id },
            data: {
                heartRate,
                stressScore: confidence,
                stressLevel: mappedLevel,
                connected: true,
                lastUpdate: new Date(),
            },
        });
        const activeSession = await this.prisma.monitoringSession.findFirst({
            where: {
                active: true,
                exam: {
                    examStudents: {
                        some: {
                            studentId: student.id,
                        },
                    },
                },
            },
        });
        if (activeSession) {
            await this.prisma.telemetryHistory.create({
                data: {
                    studentId: student.id,
                    sessionId: activeSession.id,
                    braceletId: esp32_id,
                    heartRate,
                    stressScore: confidence,
                    stressLevel: mappedLevel,
                },
            });
        }
        let displayLevel = 'Baseline';
        if (mappedLevel === client_1.StressLevel.HIGH_STRESS) {
            displayLevel = 'High Stress';
        }
        else if (mappedLevel === client_1.StressLevel.MILD_STRESS) {
            displayLevel = 'Mild Stress';
        }
        this.realtimeGateway.sendTelemetryUpdate({
            braceletId: esp32_id,
            studentId: student.id,
            heartRate,
            stressScore: confidence,
            stressLevel: displayLevel,
        });
        return {
            success: true,
            message: 'Telemetry processed and broadcasted',
            data: {
                studentId: student.id,
                heartRate,
                stressLevel: displayLevel,
                inActiveSession: !!activeSession,
            },
        };
    }
};
exports.MlService = MlService;
exports.MlService = MlService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        realtime_gateways_1.RealtimeGateway])
], MlService);
//# sourceMappingURL=ml.service.js.map