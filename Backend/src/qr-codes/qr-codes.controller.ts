import {
  Controller,
  Get,
  Post,
  Param,
  Res,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QrCodesService } from './qr-codes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('qr-codes')
@Controller('qr')
export class QrCodesController {
  constructor(private readonly qrCodesService: QrCodesService) {}

  @Post('generate/:tableId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR code for a table (Admin only)' })
  @ApiResponse({ status: 200, description: 'QR code generated as base64 data URL' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  async generate(@Param('tableId', ParseIntPipe) tableId: number) {
    const dataUrl = await this.qrCodesService.generateQrCodeForTable(tableId);
    return { tableId, qrCode: dataUrl };
  }

  @Post('generate-batch/:classroomId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Generate QR codes for all tables in a classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'QR codes batch generation complete' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  async generateBatch(@Param('classroomId', ParseIntPipe) classroomId: number) {
    return this.qrCodesService.generateBatchForClassroom(classroomId);
  }

  @Get('download/:tableId')
  @ApiOperation({ summary: 'Download QR code image for a table' })
  @ApiResponse({ status: 200, description: 'Returns PNG file download' })
  @ApiResponse({ status: 404, description: 'Table not found' })
  async download(
    @Param('tableId', ParseIntPipe) tableId: number,
    @Res() res: any,
  ) {
    const { buffer, filename } = await this.qrCodesService.getQrCodeBuffer(tableId);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  }
}
