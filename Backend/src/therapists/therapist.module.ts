import { Module } from '@nestjs/common';
import { TherapistsController } from './therapists.controller';
import { TherapistsService } from './therapists.service';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentsService } from 'src/appointments/appointment.service';

@Module({
    controllers: [TherapistsController],
    providers: [TherapistsService, PrismaService, AppointmentsService],
})
export class TherapistsModule { }