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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAdminStats() {
        const [totalStudents, totalProfessors, totalClassrooms, totalExams, activeSessions] = await Promise.all([
            this.prisma.student.count(),
            this.prisma.professor.count(),
            this.prisma.classroom.count(),
            this.prisma.exam.count(),
            this.prisma.monitoringSession.count({ where: { active: true } }),
        ]);
        return {
            totalStudents,
            totalProfessors,
            totalClassrooms,
            totalExams,
            activeSessions,
        };
    }
    async getProfessorStats(userId) {
        const professor = await this.prisma.professor.findUnique({
            where: { userId },
        });
        if (!professor) {
            throw new common_1.ForbiddenException('No professor profile linked to this user account');
        }
        const [assignedExams, activeSessions, monitoredStudents] = await Promise.all([
            this.prisma.exam.count({
                where: { professorId: professor.id },
            }),
            this.prisma.monitoringSession.count({
                where: {
                    active: true,
                    exam: { professorId: professor.id },
                },
            }),
            this.prisma.examStudent.count({
                where: {
                    exam: {
                        professorId: professor.id,
                        status: 'ONGOING',
                    },
                },
            }),
        ]);
        return {
            assignedExams,
            activeSessions,
            monitoredStudents,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map