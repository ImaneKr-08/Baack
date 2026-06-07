"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferService = void 0;
const common_1 = require("@nestjs/common");
let BufferService = class BufferService {
    buffer = new Map();
    addFrame(userId, frame) {
        if (!this.buffer.has(userId)) {
            this.buffer.set(userId, []);
        }
        const userBuffer = this.buffer.get(userId);
        userBuffer?.push(frame);
        if (userBuffer && userBuffer.length > 60) {
            userBuffer.shift();
        }
    }
    getBuffer(userId) {
        return this.buffer.get(userId) || [];
    }
    clearBuffer(userId) {
        this.buffer.delete(userId);
    }
};
exports.BufferService = BufferService;
exports.BufferService = BufferService = __decorate([
    (0, common_1.Injectable)()
], BufferService);
//# sourceMappingURL=buffer.service.js.map