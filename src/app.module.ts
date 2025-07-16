import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { Job } from './job/job.entity';
import { JobModule } from './job/job.module';
import { ConfigModule } from '@nestjs/config';
import { MailService } from './services/mail/mail.service';
import { IsAdminModule } from './services/isAdmin/isAdmin.module';
import { IsAdminService } from './services/isAdmin/isAdmin.service';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'alan', //test values
      password: 'alan', //test values
      database: 'japaris', //test values
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      retryAttempts: 6,
    }),
    TypeOrmModule.forFeature([User, Job]),
    UserModule,
    JobModule,
    IsAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, MailService, IsAdminService],
})
export class AppModule {}
