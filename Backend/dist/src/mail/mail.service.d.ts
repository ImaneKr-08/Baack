import { MailerService } from '@nestjs-modules/mailer';
export declare class MailService {
    private readonly mailerService;
    constructor(mailerService: MailerService);
    sendProfessorCredentials(email: string, fullName: string, password: string): Promise<void>;
}
