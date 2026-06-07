"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const classrooms_module_1 = require("./classrooms/classrooms.module");
const exams_module_1 = require("./exams/exams.module");
const ml_module_1 = require("./ml/ml.module");
const monitoring_module_1 = require("./monitoring/monitoring.module");
const professors_module_1 = require("./professors/professors.module");
const qr_codes_module_1 = require("./qr-codes/qr-codes.module");
const realtime_module_1 = require("./realtime/realtime.module");
const students_module_1 = require("./students/students.module");
const tables_module_1 = require("./tables/tables.module");
const users_module_1 = require("./users/users.module");
const mail_module_1 = require("./mail/mail.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            classrooms_module_1.ClassroomsModule,
            exams_module_1.ExamsModule,
            ml_module_1.MlModule,
            monitoring_module_1.MonitoringModule,
            professors_module_1.ProfessorsModule,
            qr_codes_module_1.QrCodesModule,
            realtime_module_1.RealtimeModule,
            students_module_1.StudentsModule,
            tables_module_1.TablesModule,
            users_module_1.UsersModule,
            mail_module_1.MailModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map