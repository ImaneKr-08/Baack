import { Module } from "@nestjs/common";

import { RealtimeGateway } from "./gateways/realtime.gateways";

import { BufferService } from "./services/buffer.service";

import { WindowService } from "./services/window.service";

@Module({

    providers: [

        RealtimeGateway,

        BufferService,

        WindowService,
    ],
    exports: [

    RealtimeGateway,
  ],
})
export class RealtimeModule {}