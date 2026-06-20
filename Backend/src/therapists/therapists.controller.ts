import {
    Body,
    Controller,
    Get,
    Param,
    Post,
} from '@nestjs/common';
import { TherapistsService } from './therapists.service';
import {AppointmentsService} from "../appointments/appointment.service";
@Controller('therapists')
export class TherapistsController {
    constructor(
        private readonly therapistsService: TherapistsService,
        private readonly appointmentsService: AppointmentsService,
    ) { }

    @Get()
    findAll() {
        return this.therapistsService.findAll();
    }

    @Post()
    create(@Body() body: { userId: number }) {
        return this.therapistsService.create(body.userId);
    }
    
}