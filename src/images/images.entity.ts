import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from '../event/event.entity';
import { Job } from '../job/job.entity';

@Entity()
export class Images {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  path: string;

  @Column({ nullable: true })
  eventId: number | null;

  @Column({ nullable: true })
  jobId: number | null;

  // Relations
  @ManyToOne(() => Event, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @ManyToOne(() => Job, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'jobId' })
  job: Job;
}
