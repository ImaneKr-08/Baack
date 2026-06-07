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
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let RealtimeGateway = class RealtimeGateway {
    server;
    handleConnection(client) {
        console.log(`Client connected to monitoring namespace: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected from monitoring namespace: ${client.id}`);
    }
    sendTelemetryUpdate(data) {
        console.log('Broadcasting telemetryUpdated:', data);
        this.server.emit('telemetryUpdated', data);
    }
    sendStudentConnected(data) {
        console.log('Broadcasting studentConnected:', data);
        this.server.emit('studentConnected', data);
    }
    sendStudentDisconnected(data) {
        console.log('Broadcasting studentDisconnected:', data);
        this.server.emit('studentDisconnected', data);
    }
    sendSessionStarted(data) {
        console.log('Broadcasting sessionStarted:', data);
        this.server.emit('sessionStarted', data);
    }
    sendSessionEnded(data) {
        console.log('Broadcasting sessionEnded:', data);
        this.server.emit('sessionEnded', data);
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        namespace: '/monitoring',
        cors: {
            origin: '*',
        },
    })
], RealtimeGateway);
//# sourceMappingURL=realtime.gateways.js.map