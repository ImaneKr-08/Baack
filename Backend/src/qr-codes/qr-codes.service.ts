import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as QRCode from 'qrcode';

@Injectable()
export class QrCodesService {
  constructor(private prisma: PrismaService) {}

  async generateQrCodeForTable(tableId: number): Promise<string> {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    const qrContent = `proctorinsight://table/${tableId}`;
    const dataUrl = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
    });

    await this.prisma.table.update({
      where: { id: tableId },
      data: { qrCode: dataUrl },
    });

    return dataUrl;
  }

  async generateBatchForClassroom(classroomId: number) {
    const classroom = await this.prisma.classroom.findUnique({
      where: { id: classroomId },
      include: { tables: true },
    });
    if (!classroom) {
      throw new NotFoundException(`Classroom with ID ${classroomId} not found`);
    }

    const updatedTables: any[] = [];
    for (const table of classroom.tables) {
      const dataUrl = await this.generateQrCodeForTable(table.id);
      updatedTables.push({ tableId: table.id, qrCode: dataUrl });
    }

    return {
      classroomId,
      totalGenerated: updatedTables.length,
      tables: updatedTables,
    };
  }

  async getQrCodeBuffer(tableId: number): Promise<{ buffer: Buffer; filename: string }> {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
    });
    if (!table) {
      throw new NotFoundException(`Table with ID ${tableId} not found`);
    }

    let qrCode = table.qrCode;
    if (!qrCode) {
      qrCode = await this.generateQrCodeForTable(tableId);
    }

    const base64Data = qrCode.replace(/^data:image\/png;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    return {
      buffer,
      filename: `table-${tableId}-qr.png`,
    };
  }
}
