import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassroomsService } from './classrooms.service';
import { CreateClassroomDto } from './dto/create-classroom.dto';
import { UpdateClassroomDto } from './dto/update-classroom.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/roles.enum';

@ApiTags('classrooms')
@Controller('classrooms')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new classroom (Admin only)' })
  @ApiResponse({ status: 201, description: 'Classroom successfully created' })
  create(@Body() createClassroomDto: CreateClassroomDto) {
    return this.classroomsService.create(createClassroomDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all classrooms' })
  @ApiResponse({ status: 200, description: 'Return list of classrooms' })
  findAll() {
    return this.classroomsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get classroom by ID' })
  @ApiResponse({ status: 200, description: 'Return classroom details with tables' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.classroomsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update classroom layout (Admin only)' })
  @ApiResponse({ status: 200, description: 'Classroom successfully updated' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClassroomDto: UpdateClassroomDto,
  ) {
    return this.classroomsService.update(id, updateClassroomDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Classroom successfully deleted' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.classroomsService.remove(id);
  }
}
