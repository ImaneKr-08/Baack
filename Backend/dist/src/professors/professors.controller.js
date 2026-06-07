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
exports.ProfessorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const professors_service_1 = require("./professors.service");
const create_professor_dto_1 = require("./dto/create-professor.dto");
const update_professor_dto_1 = require("./dto/update-professor.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const roles_enum_1 = require("../common/enums/roles.enum");
let ProfessorsController = class ProfessorsController {
    professorsService;
    constructor(professorsService) {
        this.professorsService = professorsService;
    }
    create(createProfessorDto) {
        return this.professorsService.create(createProfessorDto);
    }
    findAll() {
        return this.professorsService.findAll();
    }
    findOne(id) {
        return this.professorsService.findOne(id);
    }
    update(id, updateProfessorDto) {
        return this.professorsService.update(id, updateProfessorDto);
    }
    remove(id) {
        return this.professorsService.remove(id);
    }
};
exports.ProfessorsController = ProfessorsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create professor and linked login account (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Professor successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_professor_dto_1.CreateProfessorDto]),
    __metadata("design:returntype", void 0)
], ProfessorsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get all professors (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of professors' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ProfessorsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN, roles_enum_1.Role.PROFESSOR),
    (0, swagger_1.ApiOperation)({ summary: 'Get professor details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return professor data' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Professor not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfessorsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Update professor details (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Professor successfully updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Professor not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_professor_dto_1.UpdateProfessorDto]),
    __metadata("design:returntype", void 0)
], ProfessorsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Delete professor and linked user account (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Professor successfully deleted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Professor not found' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ProfessorsController.prototype, "remove", null);
exports.ProfessorsController = ProfessorsController = __decorate([
    (0, swagger_1.ApiTags)('professors'),
    (0, common_1.Controller)('professors'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [professors_service_1.ProfessorsService])
], ProfessorsController);
//# sourceMappingURL=professors.controller.js.map