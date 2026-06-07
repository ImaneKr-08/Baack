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
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TablesService = class TablesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createTableDto) {
        const { classroomId, positionX, positionY } = createTableDto;
        const classroom = await this.prisma.classroom.findUnique({
            where: { id: classroomId },
        });
        if (!classroom) {
            throw new common_1.NotFoundException(`Classroom with ID ${classroomId} not found`);
        }
        if (positionX >= classroom.columns || positionY >= classroom.rows) {
            throw new common_1.ConflictException(`Position (${positionX}, ${positionY}) is out of classroom bounds (${classroom.columns}x${classroom.rows})`);
        }
        const existingTable = await this.prisma.table.findFirst({
            where: { classroomId, positionX, positionY },
        });
        if (existingTable) {
            throw new common_1.ConflictException(`A table already exists at position (${positionX}, ${positionY})`);
        }
        return this.prisma.table.create({
            data: createTableDto,
        });
    }
    async findAll(classroomId) {
        return this.prisma.table.findMany({
            where: classroomId ? { classroomId } : undefined,
            include: {
                classroom: true,
            },
            orderBy: [
                { classroomId: 'asc' },
                { positionY: 'asc' },
                { positionX: 'asc' },
            ],
        });
    }
    async findOne(id) {
        const table = await this.prisma.table.findUnique({
            where: { id },
            include: { classroom: true },
        });
        if (!table) {
            throw new common_1.NotFoundException(`Table with ID ${id} not found`);
        }
        return table;
    }
    async update(id, updateTableDto) {
        const table = await this.findOne(id);
        const classroomId = updateTableDto.classroomId ?? table.classroomId;
        const positionX = updateTableDto.positionX ?? table.positionX;
        const positionY = updateTableDto.positionY ?? table.positionY;
        if (updateTableDto.classroomId ||
            updateTableDto.positionX !== undefined ||
            updateTableDto.positionY !== undefined) {
            const classroom = await this.prisma.classroom.findUnique({
                where: { id: classroomId },
            });
            if (!classroom) {
                throw new common_1.NotFoundException(`Classroom with ID ${classroomId} not found`);
            }
            if (positionX >= classroom.columns || positionY >= classroom.rows) {
                throw new common_1.ConflictException(`Position (${positionX}, ${positionY}) is out of classroom bounds (${classroom.columns}x${classroom.rows})`);
            }
            const existingTable = await this.prisma.table.findFirst({
                where: { classroomId, positionX, positionY, NOT: { id } },
            });
            if (existingTable) {
                throw new common_1.ConflictException(`A table already exists at position (${positionX}, ${positionY})`);
            }
        }
        return this.prisma.table.update({
            where: { id },
            data: updateTableDto,
        });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.table.delete({
            where: { id },
        });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TablesService);
//# sourceMappingURL=tables.service.js.map