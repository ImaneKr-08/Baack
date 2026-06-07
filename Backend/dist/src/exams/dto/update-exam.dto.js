"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateExamDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_exam_dto_1 = require("./create-exam.dto");
class UpdateExamDto extends (0, swagger_1.PartialType)(create_exam_dto_1.CreateExamDto) {
}
exports.UpdateExamDto = UpdateExamDto;
//# sourceMappingURL=update-exam.dto.js.map