import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private jobRepository: Repository<Job>,
  ) {}

  async findAll(): Promise<Job[]> {
    return this.jobRepository.find();
  }

  async findOne(id: number): Promise<Job | null> {
    return this.jobRepository.findOne({ where: { id } });
  }

  async create(job: Job): Promise<Job> {
    return this.jobRepository.save(job);
  }

  async update(id: number, job: Job): Promise<Job> {
    return this.jobRepository.save(job);
  }

  async remove(id: number): Promise<void> {
    await this.jobRepository.delete(id);
  }

  async findByStatus(status: string): Promise<Job[]> {
    return this.jobRepository.find({ where: { status } });
  }

  async findByCompany(company: string): Promise<Job[]> {
    return this.jobRepository.find({ where: { company } });
  }
} 