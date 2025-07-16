import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [MailerModule.forRoot({
    transport: {
      host: 'ssl0.ovh.net',
      port: 465,
      secure: true,
    },
  }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}