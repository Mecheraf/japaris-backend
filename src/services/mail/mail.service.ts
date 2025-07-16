import { Injectable } from '@nestjs/common';
import { MailerOptions, MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private readonly transporter = nodemailer.createTransport({
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@gengoffee.fr',
        pass: process.env.MAIL_PASSWORD,
      },
    });


  async sendMail(to: string, subject: string, text: string) {
    var mailOptions = {
      from: 'Contact Gengoffee <contact@gengoffee.fr>',
      to,
      subject,
      text,
    };
    await this.transporter.sendMail(mailOptions);
  }
}