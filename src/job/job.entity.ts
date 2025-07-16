import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  company: string;

  @Column()
  location: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  salary: number;

  @Column()
  jobType: string; // 'full-time', 'part-time', 'contract', 'internship'

  @Column()
  status: string; // 'active', 'closed', 'draft'

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  expiresAt: Date;

  @Column()
  requirements: string;

  @Column()
  benefits: string;

  @Column()
  contactEmail: string;
} 