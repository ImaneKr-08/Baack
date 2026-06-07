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
exports.MonitoringService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const exams_service_1 = require("../exams/exams.service");
let MonitoringService = class MonitoringService {
    prisma;
    examsService;
    constructor(prisma, examsService) {
        this.prisma = prisma;
        this.examsService = examsService;
    }
    async startSession(examId) {
        return this.examsService.start(examId);
    }
    async endSession(sessionId) {
        const session = await this.prisma.monitoringSession.findUnique({
            where: { id: sessionId },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Monitoring session with ID ${sessionId} not found`);
        }
        if (!session.active) {
            throw new common_1.BadRequestException('Monitoring session is already inactive');
        }
        return this.examsService.end(session.examId);
    }
    async getSession(id) {
        const session = await this.prisma.monitoringSession.findUnique({
            where: { id },
            include: {
                exam: {
                    include: {
                        classroom: true,
                        professor: true,
                    },
                },
            },
        });
        if (!session) {
            throw new common_1.NotFoundException(`Monitoring session with ID ${id} not found`);
        }
        return session;
    }
    async getSessionStudents(sessionId) {
        const session = await this.getSession(sessionId);
        const examStudents = await this.prisma.examStudent.findMany({
            where: { examId: session.examId },
            include: {
                student: true,
                table: true,
            },
        });
        return examStudents.map((es) => ({
            assignmentId: es.id,
            studentId: es.studentId,
            studentCode: es.student.studentCode,
            firstName: es.student.firstName,
            lastName: es.student.lastName,
            email: es.student.email,
            department: es.student.department,
            braceletId: es.student.braceletId,
            heartRate: es.student.heartRate,
            stressScore: es.student.stressScore,
            stressLevel: es.student.stressLevel,
            connected: es.student.connected,
            lastUpdate: es.student.lastUpdate,
            table: {
                id: es.table.id,
                positionX: es.table.positionX,
                positionY: es.table.positionY,
            },
        }));
    }
    async getSessionHistory(sessionId) {
        await this.getSession(sessionId);
        return this.prisma.telemetryHistory.findMany({
            where: { sessionId },
            include: {
                student: {
                    select: {
                        firstName: true,
                        lastName: true,
                        studentCode: true,
                    },
                },
            },
            orderBy: { timestamp: 'desc' },
        });
    }
    async getSessionStatistics(sessionId) {
        const session = await this.getSession(sessionId);
        const telemetry = await this.prisma.telemetryHistory.findMany({
            where: { sessionId },
        });
        if (telemetry.length === 0) {
            return {
                sessionId,
                examId: session.examId,
                totalRecords: 0,
                averageHeartRate: 0,
                maxHeartRate: 0,
                minHeartRate: 0,
                averageStressScore: 0,
                maxStressScore: 0,
                minStressScore: 0,
                stressLevelsDistribution: {
                    BASELINE: 0,
                    MILD_STRESS: 0,
                    HIGH_STRESS: 0,
                },
                studentSummaries: [],
            };
        }
        let totalHr = 0;
        let maxHr = 0;
        let minHr = 999;
        let totalStress = 0;
        let maxStress = 0;
        let minStress = 999;
        const stressDist = { BASELINE: 0, MILD_STRESS: 0, HIGH_STRESS: 0 };
        const studentData = {};
        telemetry.forEach((t) => {
            totalHr += t.heartRate;
            if (t.heartRate > maxHr)
                maxHr = t.heartRate;
            if (t.heartRate < minHr)
                minHr = t.heartRate;
            totalStress += t.stressScore;
            if (t.stressScore > maxStress)
                maxStress = t.stressScore;
            if (t.stressScore < minStress)
                minStress = t.stressScore;
            if (t.stressLevel in stressDist) {
                stressDist[t.stressLevel]++;
            }
            if (!studentData[t.studentId]) {
                studentData[t.studentId] = { hrSum: 0, stressSum: 0, count: 0, studentId: t.studentId };
            }
            studentData[t.studentId].hrSum += t.heartRate;
            studentData[t.studentId].stressSum += t.stressScore;
            studentData[t.studentId].count++;
        });
        const studentIds = Object.keys(studentData).map(Number);
        const students = await this.prisma.student.findMany({
            where: { id: { in: studentIds } },
            select: { id: true, firstName: true, lastName: true, studentCode: true },
        });
        const studentSummaries = students.map((s) => {
            const data = studentData[s.id];
            return {
                studentId: s.id,
                studentCode: s.studentCode,
                firstName: s.firstName,
                lastName: s.lastName,
                averageHeartRate: Math.round(data.hrSum / data.count),
                averageStressScore: parseFloat((data.stressSum / data.count).toFixed(2)),
                recordsCount: data.count,
            };
        });
        return {
            sessionId,
            examId: session.examId,
            totalRecords: telemetry.length,
            averageHeartRate: Math.round(totalHr / telemetry.length),
            maxHeartRate: maxHr,
            minHeartRate: minHr === 999 ? 0 : minHr,
            averageStressScore: parseFloat((totalStress / telemetry.length).toFixed(2)),
            maxStressScore: maxStress,
            minStressScore: minStress === 999 ? 0 : minStress,
            stressLevelsDistribution: stressDist,
            studentSummaries,
        };
    }
};
exports.MonitoringService = MonitoringService;
exports.MonitoringService = MonitoringService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => exams_service_1.ExamsService))),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        exams_service_1.ExamsService])
], MonitoringService);
//# sourceMappingURL=monitoring.service.js.map