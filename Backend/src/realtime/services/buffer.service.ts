import { Injectable } from "@nestjs/common";
import { SensorFrame } from "../interfaces/sensor-frame.interface";

@Injectable()
export class BufferService {
    private buffer: Map<string, SensorFrame[]> = new Map();

    addFrame(userId: string, frame: SensorFrame){
        if (!this.buffer.has(userId)) {
            this.buffer.set(userId, []);
        }
        
        const userBuffer = this.buffer.get(userId);
        userBuffer?.push(frame);
        // Keep only the last 100 frames
        if (userBuffer && userBuffer.length > 60) {
                userBuffer.shift();
        }
    }

    getBuffer(userId: string): SensorFrame[] {
        return this.buffer.get(userId) || [];
    }
    
    clearBuffer(userId: string): void {
        this.buffer.delete(userId);
    }
}