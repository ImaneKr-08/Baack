import { Controller, Get, Post, Patch, Body, Param, Delete } from "@nestjs/common";
import { AppointmentsService } from "./appointment.service";
import { CreateAppointmentDto } from "./dto/create-appointments.dto";

@Controller('appointments')
export class AppointmentsController {
    constructor(
        private readonly appointmentsService: AppointmentsService,
    ) { }

    @Get()
    findAll() {
        return this.appointmentsService.findAll();
    }

    @Post('request')
    createRequest(@Body() dto: CreateAppointmentDto) {
        return this.appointmentsService.createRequest(dto);
    }

    @Patch(':id/accept')
    accept(
        @Param('id') id: number,
        @Body() body: { dateTime: string },
    ) {
        return this.appointmentsService.accept(id, body.dateTime);
    }

    @Patch(':id/decline')
    decline(@Param('id') id: number) {
        return this.appointmentsService.decline(id);
    }
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.appointmentsService.remove(id);
    }
    @Get('my-patients/:userId')
    getMyPatients(@Param('userId') userId: number) {
        console.log('Controller userId:', userId);

        return this.appointmentsService.getMyPatients(
            Number(userId),
        );
    }
    @Get('patient/:studentId')
    getPatientSessions(
        @Param('studentId') studentId: number,
    ) {
        return this.appointmentsService.getPatientSessions(
            Number(studentId),
        );
    }
    @Post('session')
    createSession(@Body() body: any) {
        return this.appointmentsService.createSession(body);
    }

    @Patch('session/:id')
    updateSession(
        @Param('id') id: string,
        @Body() body: any,
    ) {
        return this.appointmentsService.updateSession(
            Number(id),
            body,
        );
    }

    @Delete('session/:id')
    deleteSession(
        @Param('id') id: string,
    ) {
        return this.appointmentsService.deleteSession(
            Number(id),
        );
    }
}