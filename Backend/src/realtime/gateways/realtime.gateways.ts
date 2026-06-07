import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/monitoring',
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected to monitoring namespace: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected from monitoring namespace: ${client.id}`);
  }

  sendTelemetryUpdate(data: {
    braceletId: string;
    studentId: number;
    heartRate: number;
    stressScore: number;
    stressLevel: string;
  }) {
    console.log('Broadcasting telemetryUpdated:', data);
    this.server.emit('telemetryUpdated', data);
  }

  sendStudentConnected(data: { studentId: number; braceletId: string }) {
    console.log('Broadcasting studentConnected:', data);
    this.server.emit('studentConnected', data);
  }

  sendStudentDisconnected(data: { studentId: number }) {
    console.log('Broadcasting studentDisconnected:', data);
    this.server.emit('studentDisconnected', data);
  }

  sendSessionStarted(data: { sessionId: number; examId: number; title: string }) {
    console.log('Broadcasting sessionStarted:', data);
    this.server.emit('sessionStarted', data);
  }

  sendSessionEnded(data: { sessionId: number; examId: number }) {
    console.log('Broadcasting sessionEnded:', data);
    this.server.emit('sessionEnded', data);
  }
}