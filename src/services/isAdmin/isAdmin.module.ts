import { Module } from '@nestjs/common';
import { IsAdminService } from './isAdmin.service';
import { IsAdminController } from './isAdmin.controller';
import { UserService } from '../../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../user/user.entity';
import { MailService } from '../mail/mail.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [IsAdminService, UserService, MailService],
  controllers: [IsAdminController],
  exports: [IsAdminService],
})
export class IsAdminModule {}