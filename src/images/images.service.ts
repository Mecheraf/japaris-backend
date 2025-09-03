import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Images } from './images.entity';
import { Event } from '../event/event.entity';
import { Job } from '../job/job.entity';
import * as fs from 'fs';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Images)
    private imagesRepository: Repository<Images>,
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async create(uploadData: Partial<Images>): Promise<Images> {
    const upload = this.imagesRepository.create({
      ...uploadData,
    });
    return this.imagesRepository.save(upload);
  }

  async findAll(): Promise<Images[]> {
    return this.imagesRepository.find({
      relations: ['event', 'job'],
    });
  }

  async findOne(id: number): Promise<Images | null> {
    return this.imagesRepository.findOne({
      where: { id },
      relations: ['event', 'job']
    });
  }

  async findByEventId(eventId: number): Promise<Images[]> {
    const event = await this.eventRepository.findOne({ where: { id: eventId } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.imagesRepository.find({
      where: { eventId },
      relations: ['event', 'job']
    });
  }

  async findByJobId(jobId: number): Promise<Images[]> {
    const job = await this.jobRepository.findOne({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    return this.imagesRepository.find({
      where: { jobId },
      relations: ['job', 'event']
    });
  }

  validateImageFile(mimetype: string): boolean {
    return /^image\/(jpeg|jpg|png|gif|webp)$/.test(mimetype);
  }

  validateFileSize(size: number): boolean {
    return size <= 5 * 1024 * 1024; // 5MB
  }

  async remove(id: number): Promise<void> {
    const upload = await this.findOne(id);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    try {
      if (fs.existsSync(upload.path)) {
        fs.unlinkSync(upload.path);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }

    await this.imagesRepository.delete(id);
  }

  async getFilePath(id: number): Promise<string> {
    const upload = await this.findOne(id);
    if (!upload) {
      throw new NotFoundException('Upload not found');
    }

    if (!fs.existsSync(upload.path)) {
      throw new NotFoundException('File not found on disk');
    }

    return upload.path;
  }

  async associateWithEvent(uploadId: number, eventId: number): Promise<Images> {
    const [image, event] = await Promise.all([
      this.findOne(uploadId),
      this.eventRepository.findOne({ where: { id: eventId } })
    ]);

    if (!image) {
      throw new NotFoundException('Upload not found');
    }
    if (!event) {
      throw new NotFoundException('Event not found');
    }

    image.eventId = eventId;
    image.jobId = null;
    return this.imagesRepository.save(image);
  }

  async associateWithJob(uploadId: number, jobId: number): Promise<Images> {
    const [image, job] = await Promise.all([
      this.findOne(uploadId),
      this.jobRepository.findOne({ where: { id: jobId } })
    ]);

    if (!image) {
      throw new NotFoundException('Upload not found');
    }
    if (!job) {
      throw new NotFoundException('Job not found');
    }

    image.jobId = jobId;
    image.eventId = null;
    return this.imagesRepository.save(image);
  }
}
