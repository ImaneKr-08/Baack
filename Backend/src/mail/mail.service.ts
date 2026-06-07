import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async sendProfessorCredentials(
        email: string,
        fullName: string,
        password: string,
    ) {
        await this.mailerService.sendMail({
            to: email,
            subject: 'Your ProInsight Account',
            html: `
        <h2>Welcome to ProInsight</h2>

        <p>Hello ${fullName},</p>

        <p>Your account has been created successfully.</p>

        <hr />

        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Password:</strong> ${password}</p>

        <hr />

        <p>Please change your password after your first login.</p>
      `,
        });
    }
}