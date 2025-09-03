import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Images } from './images.entity';
import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';
import { Event } from '../event/event.entity';
import { Job } from '../job/job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Images, Event, Job])],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
