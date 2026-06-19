import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/monitoring',
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(RealtimeGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.debug(`Client connected to monitoring namespace: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.debug(
      `Client disconnected from monitoring namespace: ${client.id}`,
    );
  }

  sendTelemetryUpdate(data: {
  braceletId: string;
  studentId: number;

  heartRate: number;
  hrv: number;
  gsr: number;

  stressScore: number;
  stressLevel: string;

  timestamp?: number;
}) {
    this.logger.debug(`Broadcasting telemetryUpdated: ${JSON.stringify(data)}`);
    this.server.emit('telemetryUpdated', data);
    this.logger.debug(
  `TELEMETRY PAYLOAD = ${JSON.stringify(data)}`
);
  }

  sendStudentConnected(data: { studentId: number; braceletId: string }) {
    this.logger.debug(`Broadcasting studentConnected: ${JSON.stringify(data)}`);
    this.server.emit('studentConnected', data);
  }

  sendStudentDisconnected(data: { studentId: number }) {
    this.logger.debug(
      `Broadcasting studentDisconnected: ${JSON.stringify(data)}`,
    );
    this.server.emit('studentDisconnected', data);
  }

  sendSessionStarted(data: {
    sessionId: number;
    examId: number;
    module: string;
  }) {
    this.logger.debug(`Broadcasting sessionStarted: ${JSON.stringify(data)}`);
    this.server.emit('sessionStarted', data);
  }

  sendSessionEnded(data: { sessionId: number; examId: number }) {
    this.logger.debug(`Broadcasting sessionEnded: ${JSON.stringify(data)}`);
    this.server.emit('sessionEnded', data);
  }
}
