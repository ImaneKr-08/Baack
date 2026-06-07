import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendTelemetryUpdate(data: {
        braceletId: string;
        studentId: number;
        heartRate: number;
        stressScore: number;
        stressLevel: string;
    }): void;
    sendStudentConnected(data: {
        studentId: number;
        braceletId: string;
    }): void;
    sendStudentDisconnected(data: {
        studentId: number;
    }): void;
    sendSessionStarted(data: {
        sessionId: number;
        examId: number;
        title: string;
    }): void;
    sendSessionEnded(data: {
        sessionId: number;
        examId: number;
    }): void;
}
