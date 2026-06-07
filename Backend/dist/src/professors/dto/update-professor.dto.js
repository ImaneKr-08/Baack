"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProfessorDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_professor_dto_1 = require("./create-professor.dto");
class UpdateProfessorDto extends (0, swagger_1.PartialType)(create_professor_dto_1.CreateProfessorDto) {
}
exports.UpdateProfessorDto = UpdateProfessorDto;
//# sourceMappingURL=update-professor.dto.js.map