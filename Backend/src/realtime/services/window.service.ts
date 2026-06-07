import { Injectable } from '@nestjs/common';
import { SensorFrame } from '../interfaces/sensor-frame.interface';

@Injectable()
export class WindowService {
  private readonly WINDOW_SIZE = 60;

  private readonly STEP_SIZE = 5;

  private predictionCounters: Map<string, number> =
    new Map();

  createWindow(
    userId: string,
    buffer: SensorFrame[],
  ): SensorFrame[] | null {

    if (buffer.length < this.WINDOW_SIZE) {
      return null;
    }

    const currentCount =
      this.predictionCounters.get(userId) || 0;

    if (currentCount < this.STEP_SIZE - 1) {

      this.predictionCounters.set(
        userId,
        currentCount + 1,
      );

      return null;
    }

    this.predictionCounters.set(userId, 0);

    return buffer.slice(-this.WINDOW_SIZE);
  }
}