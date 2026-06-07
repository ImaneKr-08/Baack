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
exports.StudentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
let StudentsService = class StudentsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createStudentDto) {
        const emailExists = await this.prisma.student.findUnique({
            where: { email: createStudentDto.email },
        });
        if (emailExists) {
            throw new common_1.ConflictException('Email already registered for a student');
        }
        const codeExists = await this.prisma.student.findUnique({
            where: { studentCode: createStudentDto.studentCode },
        });
        if (codeExists) {
            throw new common_1.ConflictException('Student code already registered');
        }
        if (createStudentDto.braceletId) {
            const braceletExists = await this.prisma.student.findUnique({
                where: { braceletId: createStudentDto.braceletId },
            });
            if (braceletExists) {
                throw new common_1.ConflictException('Bracelet already assigned to another student');
            }
        }
        const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);
        return this.prisma.student.create({
            data: {
                ...createStudentDto,
                password: hashedPassword,
            },
        });
    }
    async findAll(paginationDto, department) {
        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 100;
        const skip = (page - 1) * limit;
        const where = {};
        if (department) {
            where.department = department;
        }
        const search = paginationDto.search;
        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
                { studentCode: { contains: search } },
            ];
        }
        const [items, total] = await Promise.all([
            this.prisma.student.findMany({
                where,
                skip,
                take: limit,
                orderBy: { lastName: 'asc' },
            }),
            this.prisma.student.count({ where }),
        ]);
        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const student = await this.prisma.student.findUnique({
            where: { id },
            include: {
                examStudents: {
                    include: {
                        exam: true,
                        table: true,
                    },
                },
            },
        });
        if (!student) {
            throw new common_1.NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }
    async update(id, updateStudentDto) {
        await this.findOne(id);
        if (updateStudentDto.email) {
            const emailExists = await this.prisma.student.findFirst({
                where: { email: updateStudentDto.email, NOT: { id } },
            });
            if (emailExists) {
                throw new common_1.ConflictException('Email already registered for another student');
            }
        }
        if (updateStudentDto.studentCode) {
            const codeExists = await this.prisma.student.findFirst({
                where: { studentCode: updateStudentDto.studentCode, NOT: { id } },
            });
            if (codeExists) {
                throw new common_1.ConflictException('Student code already registered for another student');
            }
        }
        if (updateStudentDto.braceletId) {
            const braceletExists = await this.prisma.student.findFirst({
                where: { braceletId: updateStudentDto.braceletId, NOT: { id } },
            });
            if (braceletExists) {
                throw new common_1.ConflictException('Bracelet already assigned to another student');
            }
        }
        return this.prisma.student.update({
            where: { id },
            data: updateStudentDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.student.delete({
            where: { id },
        });
    }
};
exports.StudentsService = StudentsService;
exports.StudentsService = StudentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StudentsService);
//# sourceMappingURL=students.service.js.map