import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MlService } from './ml.service';
import { StressDataDto } from './dto/stress-data.dto';

@ApiTags('fastapi-webhook')
@Controller('ml')
export class MlController {
  private readonly logger = new Logger(MlController.name);

  constructor(private readonly mlService: MlService) {}

  @Post('stress-data')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook endpoint for FastAPI stress telemetry data ingestion',
  })
  @ApiResponse({
    status: 200,
    description: 'Stress telemetry data successfully processed',
  })
  @ApiResponse({
    status: 404,
    description: 'Student not found for the provided bracelet ID',
  })
  receiveStressData(@Body() stressDataDto: StressDataDto) {
    this.logger.debug(
      `Received stress-data webhook for braceletId=${stressDataDto.esp32_id}, stressLevel=${stressDataDto.stress_level}, confidence=${stressDataDto.confidence}`,
    );
    return this.mlService.processStressData(stressDataDto);
  }

  @Post('pair-device')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook endpoint for pairing a device to a student',
  })
  @ApiResponse({ status: 200, description: 'Device paired successfully' })
  pairDevice(@Body() body: { device_id: string; user_id: number | string }) {
    this.logger.debug(
      `Received pair-device webhook for deviceId=${body.device_id}, userId=${body.user_id}`,
    );
    return this.mlService.pairDevice(body.device_id, body.user_id);
  }
}
