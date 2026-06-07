"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowService = void 0;
const common_1 = require("@nestjs/common");
let WindowService = class WindowService {
    WINDOW_SIZE = 60;
    STEP_SIZE = 5;
    predictionCounters = new Map();
    createWindow(userId, buffer) {
        if (buffer.length < this.WINDOW_SIZE) {
            return null;
        }
        const currentCount = this.predictionCounters.get(userId) || 0;
        if (currentCount < this.STEP_SIZE - 1) {
            this.predictionCounters.set(userId, currentCount + 1);
            return null;
        }
        this.predictionCounters.set(userId, 0);
        return buffer.slice(-this.WINDOW_SIZE);
    }
};
exports.WindowService = WindowService;
exports.WindowService = WindowService = __decorate([
    (0, common_1.Injectable)()
], WindowService);
//# sourceMappingURL=window.service.js.map