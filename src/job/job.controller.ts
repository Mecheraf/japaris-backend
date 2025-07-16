import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './job.entity';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  async findAll(@Query('status') status?: string, @Query('company') company?: string): Promise<Job[]> {
    if (status) {
      return this.jobService.findByStatus(status);
    }
    if (company) {
      return this.jobService.findByCompany(company);
    }
    return this.jobService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Job | null> {
    return this.jobService.findOne(id);
  }

  @Post()
  async create(@Body() createJobDto: Omit<Job, 'id'>): Promise<Job> {
    const job = new Job();
    job.title = createJobDto.title;
    job.description = createJobDto.description;
    job.company = createJobDto.company;
    job.location = createJobDto.location;
    job.salary = createJobDto.salary;
    job.jobType = createJobDto.jobType;
    job.status = createJobDto.status || 'draft';
    job.createdAt = new Date();
    job.updatedAt = new Date();
    job.expiresAt = createJobDto.expiresAt || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days default
    job.requirements = createJobDto.requirements;
    job.benefits = createJobDto.benefits;
    job.contactEmail = createJobDto.contactEmail;
    
    return this.jobService.create(job);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateJobDto: Partial<Job>): Promise<Job> {
    const job = await this.jobService.findOne(id);
    if (!job) {
      throw new Error('Job not found');
    }
    
    Object.assign(job, updateJobDto);
    job.updatedAt = new Date();
    
    return this.jobService.update(id, job);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.jobService.remove(id);
  }
} 