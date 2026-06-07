import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MlService } from './ml.service';
import { StressDataDto } from './dto/stress-data.dto';

@ApiTags('fastapi-webhook')
@Controller('ml')
export class MlController {
  constructor(private readonly mlService: MlService) {}

  @Post('stress-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook endpoint for FastAPI stress telemetry data ingestion' })
  @ApiResponse({ status: 200, description: 'Stress telemetry data successfully processed' })
  @ApiResponse({ status: 404, description: 'Student not found for the provided bracelet ID' })
  receiveStressData(@Body() stressDataDto: StressDataDto) {
    return this.mlService.processStressData(stressDataDto);
  }
}