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
exports.ClassroomsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const classrooms_service_1 = require("./classrooms.service");
const create_classroom_dto_1 = require("./dto/create-classroom.dto");
const update_classroom_dto_1 = require("./dto/update-classroom.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let ClassroomsController = class ClassroomsController {
    classroomsService;
    constructor(classroomsService) {
        this.classroomsService = classroomsService;
    }
    create(createClassroomDto) {
        return this.classroomsService.create(createClassroomDto);
    }
    findAll() {
        return this.classroomsService.findAll();
    }
    findOne(id) {
        return this.classroomsService.findOne(id);
    }
    update(id, updateClassroomDto) {
        return this.classroomsService.update(id, updateClassroomDto);
    }
    remove(id) {
        return this.classroomsService.remove(id);
    }
};
exports.ClassroomsController = ClassroomsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new classroom (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Classroom successfully created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_classroom_dto_1.CreateClassroomDto]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all classrooms' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of classrooms' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get classroom by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return classroom details with tables' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update classroom layout (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Classroom successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_classroom_dto_1.UpdateClassroomDto]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete classroom (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Classroom successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Classroom not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ClassroomsController.prototype, "remove", null);
exports.ClassroomsController = ClassroomsController = __decorate([
    (0, swagger_1.ApiTags)('classrooms'),
    (0, common_1.Controller)('classrooms'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [classrooms_service_1.ClassroomsService])
], ClassroomsController);
//# sourceMappingURL=classrooms.controller.js.map