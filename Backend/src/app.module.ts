import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { ExamsModule } from './exams/exams.module';
import { MlModule } from './ml/ml.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { ProfessorsModule } from './professors/professors.module';
import { QrCodesModule } from './qr-codes/qr-codes.module';
import { RealtimeModule } from './realtime/realtime.module';
import { StudentsModule } from './students/students.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ClassroomsModule,
    ExamsModule,
    MlModule,
    MonitoringModule,
    ProfessorsModule,
    QrCodesModule,
    RealtimeModule,
    StudentsModule,
    TablesModule,
    UsersModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
