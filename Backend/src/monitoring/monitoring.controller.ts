import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('start/:examId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Start a monitoring session for an exam' })
  @ApiResponse({ status: 200, description: 'Session successfully started' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  startSession(@Param('examId', ParseIntPipe) examId: number) {
    return this.monitoringService.startSession(examId);
  }

  @Post('end/:sessionId')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'End a monitoring session' })
  @ApiResponse({ status: 200, description: 'Session successfully ended' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  endSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
    return this.monitoringService.endSession(sessionId);
  }

  @Get('session/:id')
  @ApiOperation({ summary: 'Get monitoring session details by ID' })
  @ApiResponse({ status: 200, description: 'Return session details' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSession(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringService.getSession(id);
  }

  @Get('session/:id/students')
  @ApiOperation({ summary: 'Get list of students in the session and their latest biosignals' })
  @ApiResponse({ status: 200, description: 'Return list of assigned students with real-time telemetry status' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSessionStudents(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringService.getSessionStudents(id);
  }

  @Get('session/:id/history')
  @ApiOperation({ summary: 'Get full telemetry logs history for a session' })
  @ApiResponse({ status: 200, description: 'Return full list of recorded telemetry points' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSessionHistory(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringService.getSessionHistory(id);
  }

  @Get('session/:id/statistics')
  @ApiOperation({ summary: 'Get aggregated statistics of stress levels and heart rate' })
  @ApiResponse({ status: 200, description: 'Return statistical summary of telemetry data' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  getSessionStatistics(@Param('id', ParseIntPipe) id: number) {
    return this.monitoringService.getSessionStatistics(id);
  }
}
