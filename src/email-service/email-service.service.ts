// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Attachment } from 'nodemailer/lib/mailer';
import { confirmationMail } from 'src/shared';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  transporter: nodemailer.Transporter<
    SMTPTransport.SentMessageInfo,
    SMTPTransport.Options
  >;
  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: 465,
      secure: true,
      auth: {
        user: this.config.get('EMAIL_USER'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(
    to: string[],
    subject: string,
    html: string,
    attachments?: Attachment[],
  ) {
    try {
      await this.transporter.sendMail({
        from: {
          name: 'ACME',
          address: process.env.EMAIL_USER ?? '',
        },
        to,
        subject,
        html,
        attachments,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      // The error is caught and logged, so the server will not crash.
      // Execution will continue after this point.
    }
  }

  async sendConfirmationEmail(token: string, firstName: string, email: string) {
    const message = confirmationMail(token, firstName);
    await this.sendMail([email], '', message);
  }
}
