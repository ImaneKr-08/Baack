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
exports.ProfessorsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcrypt"));
const mail_service_1 = require("../mail/mail.service");
let ProfessorsService = class ProfessorsService {
    prisma;
    mailService;
    constructor(prisma, mailService) {
        this.prisma = prisma;
        this.mailService = mailService;
    }
    async create(createProfessorDto) {
        const { firstName, lastName, email, department, password, } = createProfessorDto;
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const professor = await this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    name: `${firstName} ${lastName}`,
                    email,
                    password: hashedPassword,
                    role: 'PROFESSOR',
                },
            });
            return tx.professor.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    department,
                    userId: user.id,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                            createdAt: true,
                        },
                    },
                },
            });
        });
        try {
            await this.mailService.sendProfessorCredentials(email, `${firstName} ${lastName}`, password);
        }
        catch (error) {
            console.error('Email sending failed:', error);
        }
        return professor;
    }
    async findAll() {
        return this.prisma.professor.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                lastName: 'asc',
            },
        });
    }
    async findOne(id) {
        const professor = await this.prisma.professor.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        role: true,
                        createdAt: true,
                    },
                },
                exams: true,
            },
        });
        if (!professor) {
            throw new common_1.NotFoundException(`Professor with ID ${id} not found`);
        }
        return professor;
    }
    async update(id, updateProfessorDto) {
        const professor = await this.findOne(id);
        const { firstName, lastName, email, department, password, } = updateProfessorDto;
        if (email && email !== professor.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email },
            });
            if (existingUser) {
                throw new common_1.ConflictException('Email already in use');
            }
        }
        return this.prisma.$transaction(async (tx) => {
            const userUpdateData = {};
            if (firstName || lastName) {
                userUpdateData.name = `${firstName ?? professor.firstName} ${lastName ?? professor.lastName}`;
            }
            if (email) {
                userUpdateData.email = email;
            }
            if (password) {
                userUpdateData.password = await bcrypt.hash(password, 10);
            }
            if (Object.keys(userUpdateData).length > 0) {
                await tx.user.update({
                    where: {
                        id: professor.userId,
                    },
                    data: userUpdateData,
                });
            }
            return tx.professor.update({
                where: { id },
                data: {
                    firstName,
                    lastName,
                    email,
                    department,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            role: true,
                        },
                    },
                },
            });
        });
    }
    async remove(id) {
        const professor = await this.findOne(id);
        return this.prisma.user.delete({
            where: {
                id: professor.userId,
            },
        });
    }
};
exports.ProfessorsService = ProfessorsService;
exports.ProfessorsService = ProfessorsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService])
], ProfessorsService);
//# sourceMappingURL=professors.service.js.map